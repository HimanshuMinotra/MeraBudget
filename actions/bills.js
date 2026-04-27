"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeBill = (bill) => ({
  ...bill,
  amount: bill.amount ? Number(bill.amount) : 0,
  dueDate: bill.dueDate instanceof Date ? bill.dueDate.toISOString() : bill.dueDate,
  createdAt: bill.createdAt instanceof Date ? bill.createdAt.toISOString() : bill.createdAt,
  updatedAt: bill.updatedAt instanceof Date ? bill.updatedAt.toISOString() : bill.updatedAt,
});

export async function createBill(data) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const bill = await db.billReminder.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/bills");
    return { success: true, data: serializeBill(bill) };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}

export async function getBills() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const bills = await db.billReminder.findMany({
      where: { userId: user.id },
      orderBy: { dueDate: "asc" },
    });

    return { success: true, data: bills.map(serializeBill) };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}

export async function updateBillStatus(id, status) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const bill = await db.billReminder.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard");
    revalidatePath("/bills");
    return { success: true, data: serializeBill(bill) };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}

export async function deleteBill(id) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    await db.billReminder.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/bills");
    return { success: true };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}
