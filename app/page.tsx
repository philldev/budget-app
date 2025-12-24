"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Wallet,
  ArrowRight,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import { Budget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
  ItemActions,
} from "@/components/ui/item";

// Mock data
const MOCK_BUDGETS: Budget[] = [
  { id: "1", name: "Personal Q1", month: 1, year: 2024 },
  { id: "2", name: "Home Renovation", month: 3, year: 2024 },
  { id: "3", name: "Vacation Fund", month: 6, year: 2024 },
];

export default function DashboardPage() {
  // Take latest 5 budgets (mock data only has 3, but the logic is there)
  const latestBudgets = MOCK_BUDGETS.slice(0, 5);

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-2xl">
      {/* Header & Quick Actions */}
      <div className="flex flex-col gap-6 text-center items-center">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary w-fit">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground text-sm">Quick access to your recent budgets and actions.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button className="gap-2 flex-1 sm:flex-none h-10 px-6 rounded-xl shadow-xs" asChild>
            <Link href="/budgets">
              <PlusCircle className="h-4 w-4" /> Create Budget
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none h-10 px-6 rounded-xl" asChild>
            <Link href="/budgets">
              <Wallet className="h-4 w-4" /> View All Budgets
            </Link>
          </Button>
        </div>
      </div>

      {/* Latest Budgets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Latest Budgets
          </h3>
          <Link href="/budgets" className="text-[10px] font-bold text-primary hover:underline">
            Manage All
          </Link>
        </div>
        <ItemGroup>
          {latestBudgets.map((budget) => (
            <Item key={budget.id} variant="outline" className="justify-between bg-muted/20 hover:bg-muted/40 transition-all border-none py-3 px-4 rounded-xl">
              <ItemMedia>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-xs">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent className="ml-2">
                <ItemTitle>
                  <Link href={`/budgets/${budget.id}`} className="hover:underline font-bold text-sm">
                    {budget.name}
                  </Link>
                </ItemTitle>
                <ItemDescription className="text-xs">
                  {MONTHS[budget.month - 1]} {budget.year}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" className="rounded-full" asChild>
                  <Link href={`/budgets/${budget.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </ItemActions>
            </Item>
          ))}
          {latestBudgets.length === 0 && (
             <div className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-2xl">
               No budgets found. Start by creating one.
             </div>
          )}
        </ItemGroup>
      </div>
    </div>
  );
}