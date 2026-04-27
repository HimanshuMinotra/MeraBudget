import { seedTransactions } from "@/actions/seed";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  // Block seed endpoint in production entirely
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { code: 403, message: "Forbidden in production" },
      { status: 403 }
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return Response.json(
      { code: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const result = await seedTransactions();
  return Response.json(result);
}