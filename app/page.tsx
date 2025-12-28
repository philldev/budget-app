"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Shield, Wallet, TrendingUp, Sparkles } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { FaGlobe } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { SignInButton } from "@/components/auth/auth-buttons";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="flex flex-col min-h-screen relative bg-neutral-950">
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm space-y-12">
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
              {isPending ? (
                <Skeleton className="h-10 w-full rounded-md bg-neutral-900" />
              ) : session ? (
                <Button
                  asChild
                  className="w-full h-10 shadow-sm"
                  variant="default"
                >
                  <Link href="/budgets">
                    Enter Dashboard <ArrowRight className="ml-2 size-3" />
                  </Link>
                </Button>
              ) : (
                <SignInButton />
              )}

              <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="size-3" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-1 rounded-full bg-neutral-800" />
                  <span>Open Source</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid gap-6 pt-4">
            <div className="flex items-start gap-4">
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Wallet className="size-4 text-white/80" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-white/90">Budget Management</h3>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Set monthly goals and track categories with high-density
                  views.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <TrendingUp className="size-4 text-white/80" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-white/90">Expense Analytics</h3>
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
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/5 py-8 relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/philldev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <SiGithub className="size-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/deddywolley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <SiX className="size-3.5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://deddywolley.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <FaGlobe className="size-4" />
              <span className="sr-only">Website</span>
            </Link>
          </div>
          <p className="text-[10px] text-neutral-500 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} Deddy Wolley
          </p>
        </div>
      </footer>

      <BackgroundBeams />
    </div>
  );
}
