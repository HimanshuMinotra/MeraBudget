"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeSubscription = (sub) => ({
  ...sub,
  amount: sub.amount ? Number(sub.amount) : 0,
  nextBilling: sub.nextBilling instanceof Date ? sub.nextBilling.toISOString() : sub.nextBilling,
  createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt,
  updatedAt: sub.updatedAt instanceof Date ? sub.updatedAt.toISOString() : sub.updatedAt,
});

export async function createSubscription(data) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const subscription = await db.subscription.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/subscriptions");
    return { success: true, data: serializeSubscription(subscription) };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}

export async function getSubscriptions() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
    });

    if (!user) throw new Error("User not found");

    const subscriptions = await db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { amount: "desc" },
    });

    return { success: true, data: subscriptions.map(serializeSubscription) };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}

export async function deleteSubscription(id) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    await db.subscription.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/subscriptions");
    return { success: true };
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    return { success: false, error: error.message };
  }
}
