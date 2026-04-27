"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeSplitExpense = (split) => ({
  ...split,
  totalAmount: split.totalAmount ? Number(split.totalAmount) : 0,
  createdAt: split.createdAt instanceof Date ? split.createdAt.toISOString() : split.createdAt,
  updatedAt: split.updatedAt instanceof Date ? split.updatedAt.toISOString() : split.updatedAt,
});

export async function createSplitExpense(data) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const split = await db.splitExpense.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/split");
    return { success: true, data: serializeSplitExpense(split) };
  } catch (error) {
    console.error("DB Error in createSplitExpense:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getSplitExpenses() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const splits = await db.splitExpense.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: splits.map(serializeSplitExpense) };
  } catch (error) {
    console.error("DB Error in getSplitExpenses:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteSplitExpense(id) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    await db.splitExpense.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/split");
    return { success: true };
  } catch (error) {
    console.error("DB Error in deleteSplitExpense:", error.message);
    return { success: false, error: error.message };
  }
}
