"use server";

import { prisma } from "@/lib/prisma";

// ============ GET MEMBERS ============
export async function getMembers() {
  return await prisma.member.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getMemberById(id: string) {
  return await prisma.member.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { payment: true },
      },
    },
  });
}

export async function getMemberByPhone(phone: string) {
  return await prisma.member.findUnique({
    where: { phone },
  });
}

// ============ CREATE/UPDATE MEMBERS ============
export async function createMember(data: { name: string; phone: string }) {
  return await prisma.member.create({ data });
}

export async function updateMember(
  id: string,
  data: Partial<{ name: string; phone: string }>
) {
  return await prisma.member.update({
    where: { id },
    data,
  });
}

export async function deleteMember(id: string) {
  return await prisma.member.delete({
    where: { id },
  });
}

// ============ POINTS MANAGEMENT ============
export async function addPoints(memberId: string, points: number) {
  return await prisma.member.update({
    where: { id: memberId },
    data: {
      points: { increment: points },
    },
  });
}

export async function redeemPoints(memberId: string, points: number) {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) throw new Error("Member not found");
  if (member.points < points) throw new Error("Insufficient points");

  return await prisma.member.update({
    where: { id: memberId },
    data: {
      points: { decrement: points },
    },
  });
}

// ============ MEMBER STATS ============
export async function getMemberStats(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      orders: {
        where: { status: "COMPLETED" },
        include: { payment: true },
      },
    },
  });

  if (!member) throw new Error("Member not found");

  const totalSpent = member.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return {
    member,
    totalOrders: member.orders.length,
    totalSpent,
    points: member.points,
  };
}
