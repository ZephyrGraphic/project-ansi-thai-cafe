"use server";

import { prisma } from "@/lib/prisma";

// ============ CATEGORIES ============
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
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
  return await prisma.category.findMany({
    include: {
      _count: { select: { menus: true } }
    },
    orderBy: { name: "asc" },
  });
}

// ============ MENUS ============
export async function getMenus() {
  return await prisma.menu.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export async function getMenuById(id: string) {
  return await prisma.menu.findUnique({
    where: { id },
    include: { category: true, recipes: { include: { ingredient: true } } },
  });
}

export async function getMenusByCategory(categoryId: string) {
  return await prisma.menu.findMany({
    where: { categoryId },
    include: { category: true },
    orderBy: { name: "asc" },
  });
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
  const menu = await prisma.menu.findUnique({ where: { id } });
  if (!menu) throw new Error("Menu not found");
  
  return await prisma.menu.update({
    where: { id },
    data: { isAvailable: !menu.isAvailable },
  });
}
