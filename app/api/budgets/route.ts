import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allBudgets = await db.query.budgets.findMany({
      where: eq(budgets.userId, session.user.id),
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const [newBudget] = await db
      .insert(budgets)
      .values({
        ...body,
        userId: session.user.id,
      })
      .returning();
    return NextResponse.json(newBudget);
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
