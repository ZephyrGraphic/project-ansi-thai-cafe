"use server";

import { prisma } from "@/lib/prisma";
import {
  demoCategories,
  demoMenus,
  getDemoCategoriesWithMenuCount,
  getDemoMenusWithCategories,
} from "@/lib/demo-data";
import { logDemoFallback, shouldUseDemoFallback } from "@/lib/demo-fallback";

// ============ CATEGORIES ============
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getCategories", error);
      return [...demoCategories].sort((a, b) => a.name.localeCompare(b.name));
    }

    throw error;
  }
}

export async function createCategory(name: string) {
  return await prisma.category.create({
    data: { name },
  });
}

export async function updateCategory(id: string, data: { name?: string; isAvailable?: boolean }) {
  return await prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id },
  });
}

export async function getCategoriesWithMenuCount() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: { select: { menus: true } }
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getCategoriesWithMenuCount", error);
      return getDemoCategoriesWithMenuCount().sort((a, b) => a.name.localeCompare(b.name));
    }

    throw error;
  }
}

// ============ MENUS ============
export async function getMenus() {
  try {
    return await prisma.menu.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getMenus", error);
      return getDemoMenusWithCategories().sort((a, b) => a.name.localeCompare(b.name));
    }

    throw error;
  }
}

export async function getMenuById(id: string) {
  try {
    return await prisma.menu.findUnique({
      where: { id },
      include: { category: true, recipes: { include: { ingredient: true } } },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getMenuById", error);
      return getDemoMenusWithCategories().find((menu) => menu.id === id) ?? null;
    }

    throw error;
  }
}

export async function getMenusByCategory(categoryId: string) {
  try {
    return await prisma.menu.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("getMenusByCategory", error);
      return getDemoMenusWithCategories()
        .filter((menu) => menu.categoryId === categoryId)
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    throw error;
  }
}

export async function createMenu(data: {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  image?: string;
}) {
  return await prisma.menu.create({ data });
}

export async function updateMenu(
  id: string,
  data: Partial<{
    name: string;
    price: number;
    categoryId: string;
    description: string;
    image: string;
    isAvailable: boolean;
  }>
) {
  return await prisma.menu.update({
    where: { id },
    data,
  });
}

export async function deleteMenu(id: string) {
  return await prisma.menu.delete({
    where: { id },
  });
}

export async function toggleMenuAvailability(id: string) {
  try {
    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new Error("Menu not found");
    
    return await prisma.menu.update({
      where: { id },
      data: { isAvailable: !menu.isAvailable },
    });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      logDemoFallback("toggleMenuAvailability", error);
      const menu = demoMenus.find((item) => item.id === id);
      if (!menu) throw new Error("Menu not found");
      return { ...menu, isAvailable: !menu.isAvailable };
    }

    throw error;
  }
}
