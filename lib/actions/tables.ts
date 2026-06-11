"use server";

import { prisma } from "@/lib/prisma";
import { demoTables, getDemoTableById, getDemoTablesWithOrders } from "@/lib/demo-data";
import { logDemoFallback, shouldUseDemoFallback } from "@/lib/demo-fallback";
import type { TableStatus } from "@prisma/client";

// ============ GET TABLES ============
export async function getTables() {
  try {
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
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getTables", error);
      return getDemoTablesWithOrders();
    }

    throw error;
  }
}

export async function getTotalTableCapacity() {
  try {
    const tables = await prisma.table.findMany();
    return tables.reduce((acc, t) => acc + t.capacity, 0) || 20;
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getTotalTableCapacity", error);
      return demoTables.reduce((acc, table) => acc + table.capacity, 0) || 20;
    }

    throw error;
  }
}

export async function getTableById(id: string) {
  try {
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
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getTableById", error);
      return getDemoTableById(id);
    }

    throw error;
  }
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
