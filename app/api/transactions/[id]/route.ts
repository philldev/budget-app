import { db } from "@/lib/db";
import { transactions, budgets } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify transaction ownership through budget
    const userBudgets = await db
      .select({ id: budgets.id })
      .from(budgets)
      .where(eq(budgets.userId, session.user.id));
    
    const budgetIds = userBudgets.map(b => b.id);

    if (budgetIds.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const [updatedTransaction] = await db
      .update(transactions)
      .set(body)
      .where(
        and(
          eq(transactions.id, id),
          inArray(transactions.budgetId, budgetIds)
        )
      )
      .returning();

    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
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

    const { id } = await params;

    // Verify transaction ownership through budget
    const userBudgets = await db
      .select({ id: budgets.id })
      .from(budgets)
      .where(eq(budgets.userId, session.user.id));
    
    const budgetIds = userBudgets.map(b => b.id);

    if (budgetIds.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [deletedTransaction] = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, id),
          inArray(transactions.budgetId, budgetIds)
        )
      )
      .returning();

    if (!deletedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
