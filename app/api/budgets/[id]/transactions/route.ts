import { db } from "@/lib/db";
import { transactions, budgets } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: budgetId } = await params;

    // Check if the budget belongs to the user
    const budget = await db.query.budgets.findFirst({
      where: and(eq(budgets.id, budgetId), eq(budgets.userId, session.user.id)),
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const allTransactions = await db.query.transactions.findMany({
      where: eq(transactions.budgetId, budgetId),
      orderBy: [desc(transactions.date)],
    });

    return NextResponse.json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
