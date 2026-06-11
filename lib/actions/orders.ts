"use server";

import { prisma } from "@/lib/prisma";
import { demoOrders } from "@/lib/demo-data";
import { logDemoFallback, shouldUseDemoFallback } from "@/lib/demo-fallback";
import { deductStockForOrder } from "./inventory";

type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

// ============ GET ORDERS ============
export async function getOrders(status?: OrderStatus | OrderStatus[]) {
  const where = status
    ? { status: Array.isArray(status) ? { in: status } : status }
    : undefined;

  try {
    return await prisma.order.findMany({
      where,
      include: {
        table: true,
        user: true,
        member: true,
        orderItems: { include: { menu: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getOrders", error);
      const statuses = status ? (Array.isArray(status) ? status : [status]) : null;
      return demoOrders
        .filter((order) => !statuses || statuses.includes(order.status as OrderStatus))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    throw error;
  }
}

export async function getOrderById(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        table: true,
        user: true,
        member: true,
        orderItems: { include: { menu: true } },
        payment: true,
      },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getOrderById", error);
      return demoOrders.find((order) => order.id === id) ?? null;
    }

    throw error;
  }
}

export async function getActiveOrders() {
  try {
    return await prisma.order.findMany({
      where: {
        status: { in: ["PENDING", "PREPARING", "READY"] },
      },
      include: {
        table: true,
        orderItems: { include: { menu: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getActiveOrders", error);
      return demoOrders
        .filter((order) => ["PENDING", "PREPARING", "READY"].includes(order.status))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    throw error;
  }
}

export async function getTableActiveOrders(tableId: string) {
  try {
    return await prisma.order.findMany({
      where: {
        tableId,
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
      include: {
        orderItems: { include: { menu: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getTableActiveOrders", error);
      return demoOrders
        .filter((order) => order.tableId === tableId && !["COMPLETED", "CANCELLED"].includes(order.status))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    throw error;
  }
}

export async function getKitchenOrders() {
  try {
    return await prisma.order.findMany({
      where: {
        status: { in: ["PENDING", "PREPARING", "READY"] },
      },
      include: {
        table: true,
        orderItems: { include: { menu: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getKitchenOrders", error);
      return demoOrders
        .filter((order) => ["PENDING", "PREPARING", "READY"].includes(order.status))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    throw error;
  }
}

export async function getCompletedOrders() {
  try {
    return await prisma.order.findMany({
      where: {
        status: { in: ["COMPLETED", "SERVED", "CANCELLED"] },
      },
      include: {
        table: true,
        orderItems: { include: { menu: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to last 50 orders
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getCompletedOrders", error);
      return demoOrders
        .filter((order) => ["COMPLETED", "SERVED", "CANCELLED"].includes(order.status))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 50);
    }

    throw error;
  }
}

// ============ CREATE ORDER ============
export async function createOrder(data: {
  tableId: string;
  userId?: string;
  memberId?: string;
  notes?: string;
  items: { menuId: string; qty: number; notes?: string }[];
}) {
  // Calculate totals
  const menus = await prisma.menu.findMany({
    where: { id: { in: data.items.map((i) => i.menuId) } },
  });

  const orderItems = data.items.map((item) => {
    const menu = menus.find((m) => m.id === item.menuId);
    return {
      menuId: item.menuId,
      qty: item.qty,
      subtotal: (menu?.price || 0) * item.qty,
      notes: item.notes,
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  return await prisma.order.create({
    data: {
      tableId: data.tableId,
      userId: data.userId,
      memberId: data.memberId,
      notes: data.notes,
      totalAmount,
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      table: true,
      orderItems: { include: { menu: true } },
    },
  });
}

// ============ UPDATE ORDER ============
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { table: true },
  });

  // Update table status based on order status
  if (status === "COMPLETED" || status === "CANCELLED") {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: "CLEANING" },
    });
  }

  return order;
}

export async function addOrderItem(
  orderId: string,
  item: { menuId: string; qty: number; notes?: string },
) {
  const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
  if (!menu) throw new Error("Menu not found");

  const subtotal = menu.price * item.qty;

  const orderDetail = await prisma.orderDetail.create({
    data: {
      orderId,
      menuId: item.menuId,
      qty: item.qty,
      subtotal,
      notes: item.notes,
    },
  });

  // Update order total
  await prisma.order.update({
    where: { id: orderId },
    data: {
      totalAmount: { increment: subtotal },
    },
  });

  return orderDetail;
}

export async function removeOrderItem(orderDetailId: string) {
  const orderDetail = await prisma.orderDetail.findUnique({
    where: { id: orderDetailId },
  });

  if (!orderDetail) throw new Error("Order item not found");

  await prisma.orderDetail.delete({ where: { id: orderDetailId } });

  // Update order total
  await prisma.order.update({
    where: { id: orderDetail.orderId },
    data: {
      totalAmount: { decrement: orderDetail.subtotal },
    },
  });

  return true;
}

// ============ CREATE SELF ORDER (CUSTOMER) ============
export async function createSelfOrder(data: {
  tableId: string;
  customerName: string;
  queueId?: string;
  notes?: string;
  items: { menuId: string; qty: number; notes?: string }[];
}) {
  // Calculate totals
  const menus = await prisma.menu.findMany({
    where: { id: { in: data.items.map((i) => i.menuId) } },
  });

  const orderItems = data.items.map((item) => {
    const menu = menus.find((m) => m.id === item.menuId);
    return {
      menuId: item.menuId,
      qty: item.qty,
      subtotal: (menu?.price || 0) * item.qty,
      notes: item.notes,
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Update table status to occupied if it isn't already
  await prisma.table.update({
    where: { id: data.tableId },
    data: { status: "OCCUPIED" },
  });

  const order = await prisma.order.create({
    data: {
      tableId: data.tableId,
      customerName: data.customerName,
      queueId: data.queueId,
      source: "CUSTOMER", // Source enum
      notes: data.notes,
      totalAmount,
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      table: true,
      orderItems: { include: { menu: true } },
    },
  });

  // Attempt to immediately deduct stock because self-orders are live
  try {
    await deductStockForOrder(order.id);
  } catch (error) {
    console.error("Failed to automatically deduct stock on self-order", error);
    // Even if it fails, we keep the order and just log it.
  }

  return order;
}
