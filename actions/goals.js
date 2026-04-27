"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to convert Prisma items to plain objects
function serializeGoal(goal) {
  return {
    ...goal,
    targetAmount: goal.targetAmount ? Number(goal.targetAmount) : 0,
    currentAmount: goal.currentAmount ? Number(goal.currentAmount) : 0,
    monthlyContribution: goal.monthlyContribution ? Number(goal.monthlyContribution) : 0,
    createdAt: goal.createdAt instanceof Date ? goal.createdAt.toISOString() : goal.createdAt,
    updatedAt: goal.updatedAt instanceof Date ? goal.updatedAt.toISOString() : goal.updatedAt,
  };
}

export async function createGoal(data) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const goal = await db.savingsGoal.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/goals");
    return { success: true, data: serializeGoal(goal) };
  } catch (error) {
    console.error("DB Error in createGoal:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getGoals() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const goals = await db.savingsGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: goals.map(serializeGoal) };
  } catch (error) {
    console.error("DB Error in getGoals:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateGoalProgress(id, currentAmount) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const goal = await db.savingsGoal.update({
      where: { id },
      data: { currentAmount },
    });

    revalidatePath("/dashboard");
    revalidatePath("/goals");
    return { success: true, data: serializeGoal(goal) };
  } catch (error) {
    console.error("DB Error in updateGoalProgress:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteGoal(id) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    await db.savingsGoal.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    console.error("DB Error in deleteGoal:", error.message);
    return { success: false, error: error.message };
  }
}
