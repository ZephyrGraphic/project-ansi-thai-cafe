"use server";

import { prisma } from "@/lib/prisma";

type StockLogType = "IN" | "OUT";

// ============ GET INGREDIENTS ============
export async function getIngredients() {
  return await prisma.ingredient.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getIngredientById(id: string) {
  return await prisma.ingredient.findUnique({
    where: { id },
    include: {
      recipes: { include: { menu: true } },
      stockLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function getLowStockIngredients() {
  return await prisma.ingredient.findMany({
    where: {
      currentStock: { lte: prisma.ingredient.fields.minStock },
    },
    orderBy: { currentStock: "asc" },
  });
}

// ============ CREATE/UPDATE INGREDIENTS ============
export async function createIngredient(data: {
  name: string;
  unit: string;
  currentStock?: number;
  minStock?: number;
  costPerUnit?: number;
}) {
  return await prisma.ingredient.create({ data });
}

export async function updateIngredient(
  id: string,
  data: Partial<{
    name: string;
    unit: string;
    currentStock: number;
    minStock: number;
    costPerUnit: number;
  }>
) {
  return await prisma.ingredient.update({
    where: { id },
    data,
  });
}

export async function deleteIngredient(id: string) {
  return await prisma.ingredient.delete({
    where: { id },
  });
}

// ============ STOCK LOGS ============
export async function addStockLog(data: {
  ingredientId: string;
  type: StockLogType;
  qty: number;
  notes?: string;
}) {
  // Create stock log
  const stockLog = await prisma.stockLog.create({ data });

  // Update ingredient stock
  const ingredient = await prisma.ingredient.update({
    where: { id: data.ingredientId },
    data: {
      currentStock:
        data.type === "IN"
          ? { increment: data.qty }
          : { decrement: data.qty },
    },
  });

  return { stockLog, ingredient };
}

export async function getStockLogs(ingredientId?: string) {
  return await prisma.stockLog.findMany({
    where: ingredientId ? { ingredientId } : undefined,
    include: { ingredient: true },
    orderBy: { createdAt: "desc" },
  });
}

// ============ RECIPES (BOM) ============
export async function getRecipesByMenu(menuId: string) {
  return await prisma.recipe.findMany({
    where: { menuId },
    include: { ingredient: true },
  });
}

export async function addRecipeIngredient(data: {
  menuId: string;
  ingredientId: string;
  qtyNeeded: number;
  unit: string;
}) {
  return await prisma.recipe.create({ data });
}

export async function updateRecipeIngredient(
  menuId: string,
  ingredientId: string,
  data: { qtyNeeded?: number; unit?: string }
) {
  return await prisma.recipe.update({
    where: {
      menuId_ingredientId: { menuId, ingredientId },
    },
    data,
  });
}

export async function removeRecipeIngredient(menuId: string, ingredientId: string) {
  return await prisma.recipe.delete({
    where: {
      menuId_ingredientId: { menuId, ingredientId },
    },
  });
}

// ============ DEDUCT STOCK ON ORDER ============
export async function deductStockForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          menu: {
            include: { recipes: true },
          },
        },
      },
    },
  });

  if (!order) throw new Error("Order not found");

  // Calculate required ingredients
  const ingredientDeductions: { ingredientId: string; qty: number }[] = [];

  for (const item of order.orderItems) {
    for (const recipe of item.menu.recipes) {
      const existing = ingredientDeductions.find(
        (d) => d.ingredientId === recipe.ingredientId
      );
      if (existing) {
        existing.qty += recipe.qtyNeeded * item.qty;
      } else {
        ingredientDeductions.push({
          ingredientId: recipe.ingredientId,
          qty: recipe.qtyNeeded * item.qty,
        });
      }
    }
  }

  // Deduct stock and create logs
  for (const deduction of ingredientDeductions) {
    await addStockLog({
      ingredientId: deduction.ingredientId,
      type: "OUT",
      qty: deduction.qty,
      notes: `Order #${orderId}`,
    });
  }

  return ingredientDeductions;
}
