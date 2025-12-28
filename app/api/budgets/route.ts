import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allBudgets = await db.query.budgets.findMany({
      orderBy: [desc(budgets.year), desc(budgets.month)],
    });
    return NextResponse.json(allBudgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [newBudget] = await db.insert(budgets).values(body).returning();
    return NextResponse.json(newBudget);
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
