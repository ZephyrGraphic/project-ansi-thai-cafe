"use server";

import { prisma } from "@/lib/prisma";
import { demoOrders, demoPayments, getDemoPaymentSummary } from "@/lib/demo-data";
import { logDemoFallback, shouldUseDemoFallback } from "@/lib/demo-fallback";
import type { PaymentMethod } from "@prisma/client";

// ============ PROCESS PAYMENT ============
export async function processPayment(data: {
  orderId: string;
  method: PaymentMethod;
  memberId?: string;
}) {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: { payment: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.payment) throw new Error("Order already paid");

  const payment = await prisma.payment.create({
    data: {
      orderId: data.orderId,
      amount: order.totalAmount,
      method: data.method,
    },
  });

  // Update order status to COMPLETED and link member if provided
  await prisma.order.update({
    where: { id: data.orderId },
    data: { 
      status: "COMPLETED",
      memberId: data.memberId || null,
    },
  });

  // Update table status to CLEANING
  await prisma.table.update({
    where: { id: order.tableId },
    data: { status: "CLEANING" },
  });

  return payment;
}

export async function getPaymentByOrder(orderId: string) {
  try {
    return await prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getPaymentByOrder", error);
      const payment = demoPayments.find((item) => item.orderId === orderId);
      if (!payment) return null;
      return {
        ...payment,
        order: demoOrders.find((order) => order.id === orderId) ?? null,
      };
    }

    throw error;
  }
}

// ============ PAYMENT REPORTS ============
export async function getDailyPayments(date?: Date) {
  const targetDate = date || new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    return await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        order: {
          include: {
            table: true,
            orderItems: { include: { menu: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getDailyPayments", error);
      return demoPayments
        .filter((payment) => payment.createdAt >= startOfDay && payment.createdAt <= endOfDay)
        .map((payment) => ({
          ...payment,
          order: demoOrders.find((order) => order.id === payment.orderId) ?? demoOrders[0],
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    throw error;
  }
}

export async function getPaymentSummary(startDate: Date, endDate: Date) {
  let payments;

  try {
    payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getPaymentSummary", error);
      return getDemoPaymentSummary();
    }

    throw error;
  }

  const totalCash = payments
    .filter((p) => p.method === "CASH")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalQris = payments
    .filter((p) => p.method === "QRIS")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    totalTransactions: payments.length,
    totalAmount: totalCash + totalQris,
    totalCash,
    totalQris,
  };
}
