"use server";

import { prisma } from "@/lib/prisma";

type OrderStatus = "PENDING" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";

// ============ GET ORDERS ============
export async function getOrders(status?: OrderStatus | OrderStatus[]) {
  const where = status
    ? { status: Array.isArray(status) ? { in: status } : status }
    : undefined;

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
}

export async function getOrderById(id: string) {
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
}

export async function getActiveOrders() {
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
}

export async function getKitchenOrders() {
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
}

export async function getCompletedOrders() {
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
  item: { menuId: string; qty: number; notes?: string }
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
