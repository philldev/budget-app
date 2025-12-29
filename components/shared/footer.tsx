"use client";

import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { Separator } from "../ui/separator";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-4 mt-auto">
      <div className="container mx-auto max-w-xl px-6">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs tracking-tight text-muted-foreground"
            >
              BudgetApp
            </Link>
            <Separator orientation="vertical" className="h-4 bg-muted" />
            <Link
              href="https://deddywolley.com"
              className="text-xs tracking-tight text-muted-foreground"
            >
              deddywolley.com
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/philldev/budget-app"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Github className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
