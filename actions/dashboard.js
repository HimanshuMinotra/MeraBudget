"use server";

import { revalidatePath } from "next/cache";
import {db} from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const serializeTransaction =(obj) => {
 const serialized = { ...obj};

 if(obj.balance){
 serialized.balance = obj.balance.toNumber(); 
}

if(obj.amount){
  serialized.amount = obj.amount.toNumber(); 
 }

 return serialized;
};

export async function CreateAccount(data){
 try{
 const {userId} = await auth();
 if (!userId) throw new Error("Unauthorized");

 const user = await db.user.findUnique({
 where: {clerkUserid: userId},
 });

 if(!user){
 throw new Error("User not found");
 }

 const balanceFloat = parseFloat(data.balance)
 if(isNaN(balanceFloat)){
 throw new Error("Invalid Balance amount");
 }

 const existingAccounts = await db.account.findMany({
 where: {userId: user.id},
 });

 const shouldBeDefault = existingAccounts.length === 0? true: data.isDefault;

 if (shouldBeDefault){
 await db.account.updateMany({
 where: {userId: user.id, isDefault: true},
 data: {isDefault: false},
 });
 }

 const account = await db.account.create({
 data:{
 ...data,
 balance:balanceFloat,
 userId: user.id,
 isDefault: shouldBeDefault,
},
 });

const serializedAccount =  serializeTransaction(account);
revalidatePath("/dashboard")
return { success: true, data: serializedAccount};
  } catch (error) {
    console.error("CREATE ACCOUNT ERROR:", error.message);
    return { error: error.message || "Failed to create account" };
  }
}

export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: userId },
    });

    if (!user) {
      return []; // Return empty if user not found instead of crashing
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return accounts.map(serializeTransaction);
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    console.error("DB Error in getUserAccounts:", error.message);
    return []; // Return empty array on DB error to let UI degrade gracefully
  }
}

export async function updateDefaultAccount(id) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const user = await db.user.findUnique({
    where: { clerkUserid: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }
  
  try {
    await db.$transaction([
      db.account.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      }),
      db.account.update({
        where: { id: id, userId: user.id },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("UPDATE DEFAULT ERROR:", error.message);
    return { error: "Failed to update default account." };
  }
}

// --- THIS IS THE UPDATED FUNCTION ---
// I changed it to not use 'formData'
export async function deleteAccount(id) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  if (!id) {
    return { error: "No account ID provided." };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserid: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    await db.account.delete({
      where: {
        id: id,
        userId: user.id, // Security check!
      },
    });

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);
    return { error: "Failed to delete account." };
  }
}

export async function getDashboardData(dateFilter = null) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserid: userId },
    });

    if (!user) {
      return [];
    }

    const whereClause = { userId: user.id };

    if (dateFilter) {
      const start = new Date(dateFilter);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateFilter);
      end.setHours(23, 59, 59, 999);

      whereClause.date = {
        gte: start,
        lte: end,
      };
    }

    const transactions = await db.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" }
    });

    return transactions.map(serializeTransaction);
  } catch (error) {
    if (error.message.includes("Dynamic server usage")) throw error;
    console.error("DB Error in getDashboardData:", error.message);
    return [];
  }
}