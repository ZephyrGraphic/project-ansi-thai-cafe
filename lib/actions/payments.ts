"use server";

import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@prisma/client";

// ============ PROCESS PAYMENT ============
export async function processPayment(data: {
  orderId: string;
  method: PaymentMethod;
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

  // Update order status to COMPLETED
  await prisma.order.update({
    where: { id: data.orderId },
    data: { status: "COMPLETED" },
  });

  // Update table status to CLEANING
  await prisma.table.update({
    where: { id: order.tableId },
    data: { status: "CLEANING" },
  });

  return payment;
}

export async function getPaymentByOrder(orderId: string) {
  return await prisma.payment.findUnique({
    where: { orderId },
    include: { order: true },
  });
}

// ============ PAYMENT REPORTS ============
export async function getDailyPayments(date?: Date) {
  const targetDate = date || new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

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
}

export async function getPaymentSummary(startDate: Date, endDate: Date) {
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

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
