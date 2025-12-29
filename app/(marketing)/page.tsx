"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Wallet, TrendingUp, Sparkles, Github } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SignInButton } from "@/components/auth/auth-buttons";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "motion/react";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <motion.div
      key="homepage-content"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm space-y-12 p-4"
    >
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-neutral-900 text-neutral-400 border-neutral-800"
            >
              Personal Project
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            BudgetApp
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            A minimalist, high-density tool for personal finance management.
            Built with Next.js, Turso, and Better-Auth.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Skeleton className="h-10 w-full rounded-md bg-neutral-900" />
              </motion.div>
            ) : session ? (
              <motion.div
                key="logged-in"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Button
                  asChild
                  className="w-full h-10 shadow-sm"
                  variant="default"
                >
                  <Link href="/budgets">
                    Enter Dashboard <ArrowRight className="ml-2 size-3" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="logged-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <SignInButton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid gap-6 pt-4">
        <div className="flex items-start gap-4">
          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
            <Wallet className="size-4 text-white/80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-white/90">
              Budget Management
            </h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Set monthly goals and track categories with high-density views.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
            <TrendingUp className="size-4 text-white/80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-white/90">
              Expense Analytics
            </h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Visualize your spending patterns with clean, minimal charts.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
            <Sparkles className="size-4 text-white/80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-white/90">Refined UX</h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Focused on utility and speed for quick daily entries.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
            <Github className="size-4 text-white/80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-white/90">Open Source</h3>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Fully open source and available on{" "}
              <Link
                href="https://github.com/philldev/budget-app"
                target="_blank"
                className="text-white hover:underline underline-offset-2"
              >
                GitHub
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
