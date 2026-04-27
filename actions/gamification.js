"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function checkStreaksAndAchievements() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
      include: {
        streak: true,
        transactions: true,
        achievements: true,
      },
    });

    if (!user) throw new Error("User not found");

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 1. Update Streak
    let userStreak = user.streak;
    if (!userStreak) {
      userStreak = await db.userStreak.create({
        data: { userId: user.id },
      });
    }

    const lastActivity = new Date(userStreak.lastActivity);
    const lastActivityDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
    
    const diffTime = Math.abs(today - lastActivityDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let updatedStreak = userStreak.currentStreak;
    let updatedLongest = userStreak.longestStreak;

    if (diffDays === 1) {
      updatedStreak += 1;
    } else if (diffDays > 1) {
      updatedStreak = 1; // Streak reset
    }

    if (updatedStreak > updatedLongest) {
      updatedLongest = updatedStreak;
    }

    await db.userStreak.update({
      where: { id: userStreak.id },
      data: {
        currentStreak: updatedStreak,
        longestStreak: updatedLongest,
        lastActivity: now,
      },
    });

    // 2. Check Achievements
    const newAchievements = [];
    
    // "Disciplined Spender" - 7 days of transactions (mock logic for demo)
    if (updatedStreak >= 7 && !user.achievements.find(a => a.type === "DISCIPLINED_SPENDER")) {
        newAchievements.push({
            type: "DISCIPLINED_SPENDER",
            name: "Disciplined Spender",
            description: "Maintained a financial streak for 7 days!",
            icon: "ShieldCheck"
        });
    }

    // "Savings Master" - If they have a savings goal reached (check savings_goals table)
    const goals = await db.savingsGoal.findMany({ where: { userId: user.id } });
    const reachedGoal = goals.find(g => Number(g.currentAmount) >= Number(g.targetAmount));
    if (reachedGoal && !user.achievements.find(a => a.type === "SAVINGS_MASTER")) {
        newAchievements.push({
            type: "SAVINGS_MASTER",
            name: "Savings Master",
            description: "Reached your first savings goal!",
            icon: "Trophy"
        });
    }

    // "Transaction Titan" - 10 transactions
    if (user.transactions.length >= 10 && !user.achievements.find(a => a.type === "TRANSACTION_TITAN")) {
        newAchievements.push({
            type: "TRANSACTION_TITAN",
            name: "Transaction Titan",
            description: "Logged over 10 transactions!",
            icon: "Zap"
        });
    }

    if (newAchievements.length > 0) {
        await db.achievement.createMany({
            data: newAchievements.map(a => ({ ...a, userId: user.id }))
        });
    }

    revalidatePath("/dashboard");
    return { 
        streak: updatedStreak, 
        newAchievements, 
        allAchievements: [...user.achievements, ...newAchievements] 
    };
  } catch (error) {
    console.error("Gamification Error:", error);
    return { error: error.message };
  }
}

export async function getUserGamificationData() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: clerkUserId },
      include: {
        streak: true,
        achievements: true,
      },
    });

    return {
      streak: user?.streak || { currentStreak: 0, longestStreak: 0 },
      achievements: user?.achievements || [],
    };
  } catch (error) {
    return { error: error.message };
  }
}
