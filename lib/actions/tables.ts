"use server";

import { prisma } from "@/lib/prisma";
import type { TableStatus } from "@prisma/client";

// ============ GET TABLES ============
export async function getTables() {
  return await prisma.table.findMany({
    include: {
      orders: {
        where: {
          status: { in: ["PENDING", "PREPARING", "READY", "SERVED"] },
        },
        include: {
          orderItems: { include: { menu: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { tableNo: "asc" },
  });
}

export async function getTableById(id: string) {
  return await prisma.table.findUnique({
    where: { id },
    include: {
      orders: {
        where: {
          status: { in: ["PENDING", "PREPARING", "READY", "SERVED"] },
        },
        include: {
          orderItems: { include: { menu: true } },
        },
      },
    },
  });
}

// ============ CREATE/UPDATE TABLES ============
export async function createTable(data: {
  tableNo: number;
  capacity: number;
  zone?: string;
}) {
  return await prisma.table.create({ data });
}

export async function updateTable(
  id: string,
  data: Partial<{ tableNo: number; capacity: number; zone: string; status: TableStatus }>
) {
  return await prisma.table.update({
    where: { id },
    data,
  });
}

export async function updateTableStatus(id: string, status: TableStatus) {
  return await prisma.table.update({
    where: { id },
    data: { status },
  });
}

export async function deleteTable(id: string) {
  return await prisma.table.delete({
    where: { id },
  });
}
