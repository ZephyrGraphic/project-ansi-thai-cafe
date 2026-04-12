"use server";

import { prisma } from "@/lib/prisma";

type QueueStatus = "WAITING" | "CALLED" | "SEATED" | "CANCELLED";

// ============ REVALIDATION PATHS ============
// We can use revalidatePath if needed, but usually it's handled by the caller.

// ============ JOIN QUEUE ============
export async function joinQueue(data: {
  name: string;
  phone: string;
  pax: number;
  notes?: string;
}) {
  const queue = await prisma.queue.create({
    data: {
      name: data.name,
      phone: data.phone,
      pax: data.pax,
      notes: data.notes,
      status: "WAITING",
    },
  });

  // Calculate position ahead
  const positionAhead = await prisma.queue.count({
    where: {
      status: "WAITING",
      createdAt: { lt: queue.createdAt },
    },
  });

  return { queue, positionAhead };
}

// ============ GET ACTIVE QUEUES ============
export async function getActiveQueues() {
  return await prisma.queue.findMany({
    where: {
      status: { in: ["WAITING", "CALLED"] },
    },
    orderBy: { createdAt: "asc" },
  });
}

// ============ GET ALL QUEUES ============
export async function getAllQueues() {
  return await prisma.queue.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ============ UPDATE QUEUE STATUS ============
export async function updateQueueStatus(id: string, status: QueueStatus) {
  return await prisma.queue.update({
    where: { id },
    data: { status },
  });
}

// ============ CANCEL QUEUE ============
export async function cancelQueue(id: string) {
  return await prisma.queue.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}
