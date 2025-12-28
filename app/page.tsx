"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Wallet, TrendingUp, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SignInButton } from "@/components/auth/auth-buttons";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">BudgetApp</h1>
          <p className="text-sm text-muted-foreground">
            A compact tool for personal finance management.
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Get Started</CardTitle>
            <CardDescription className="text-xs">
              Take control of your spending with our minimalist dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3 rounded-md border p-3">
                <Wallet className="mt-0.5 size-4 text-primary" />
                <div className="space-y-0.5">
                  <p className="text-xs font-medium">Visual Tracking</p>
                  <p className="text-[11px] text-muted-foreground">Monitor budgets with high-density views.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-md border p-3">
                <TrendingUp className="mt-0.5 size-4 text-primary" />
                <div className="space-y-0.5">
                  <p className="text-xs font-medium">Expense Analysis</p>
                  <p className="text-[11px] text-muted-foreground">Understand your habits through clean data.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              {isPending ? (
                <Skeleton className="h-7 w-full rounded-md" />
              ) : session ? (
                <Button asChild className="w-full" variant="secondary">
                  <Link href="/budgets">
                    Go to Dashboard <ArrowRight className="ml-2 size-3" />
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                   <SignInButton />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="size-3" />
            Secure by Turso
          </div>
          <div className="flex items-center gap-1">
            <span>•</span>
            Minimalist Design
          </div>
        </div>
      </div>
    </div>
  );
}