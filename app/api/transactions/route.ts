import { db } from "@/lib/db";
import { transactions, budgets } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { budgetId } = body;

    // Check if the budget belongs to the user
    const budget = await db.query.budgets.findFirst({
      where: and(eq(budgets.id, budgetId), eq(budgets.userId, session.user.id)),
    });

    if (!budget) {
      return NextResponse.json({ error: "Unauthorized access to budget" }, { status: 403 });
    }

    const [newTransaction] = await db.insert(transactions).values(body).returning();
    return NextResponse.json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
