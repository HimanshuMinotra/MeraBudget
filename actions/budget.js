"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeBudget = (budget) => ({
  ...budget,
  amount: budget.amount ? Number(budget.amount) : 0,
  createdAt: budget.createdAt instanceof Date ? budget.createdAt.toISOString() : budget.createdAt,
  updatedAt: budget.updatedAt instanceof Date ? budget.updatedAt.toISOString() : budget.updatedAt,
});

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.findFirst({
      where: {
        userID: user.id,
      },
    });

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      }
    });

    return {
      budget: budget ? serializeBudget(budget) : null,
      currentExpenses: expenses._sum.amount ? Number(expenses._sum.amount) : 0,
    };

  } catch (error) {
    console.error("Error fetching budget:", error.message);
    return { budget: null, currentExpenses: 0 };
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.upsert({
      where: {
        userID: user.id,
      },
      update: {
        amount,
      },
      create: {
        userID: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: serializeBudget(budget),
    };
  } catch (error) {
    console.error("Error updating budget:", error.message);
    return { success: false, error: error.message };
  }
}