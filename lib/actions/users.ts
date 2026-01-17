"use server";

import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

// ============ GET USERS ============
export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByCredentials(username: string, password: string) {
  return await prisma.user.findFirst({
    where: { username, password },
  });
}

// ============ CREATE/UPDATE USERS ============
export async function createUser(data: {
  username: string;
  password: string;
  role: UserRole;
  name?: string;
  email?: string;
}) {
  return await prisma.user.create({ data });
}

export async function updateUser(
  id: string,
  data: Partial<{
    username: string;
    password: string;
    role: UserRole;
    name: string;
    email: string;
    avatar: string;
  }>
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
