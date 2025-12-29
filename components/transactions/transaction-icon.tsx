"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionIconProps {
  type: "income" | "expense";
  percentage: number;
}

export function TransactionIcon({ type, percentage }: TransactionIconProps) {
  const width = 28;
  const height = 28;
  const rx = 8;
  const perimeter =
    2 * (width - 2 * rx) + 2 * (height - 2 * rx) + 2 * Math.PI * rx;
  const offset = perimeter - (percentage / 100) * perimeter;

  return (
    <div className="relative flex items-center justify-center p-1">
      <svg
        className="absolute transition-all duration-500"
        width="30"
        height="30"
        viewBox="0 0 30 30"
      >
        <rect
          x="1"
          y="1"
          width={width}
          height={height}
          rx={rx}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted/10"
        />
        <rect
          x="1"
          y="1"
          width={width}
          height={height}
          rx={rx}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={perimeter}
          style={{
            strokeDashoffset: offset,
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
          className={cn(
            "transition-all duration-1000 ease-in-out",
            type === "income" ? "text-emerald-500" : "text-destructive",
          )}
        />
      </svg>
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg z-10",
          type === "income" ? "bg-emerald-500/10" : "bg-destructive/10",
        )}
      >
        {type === "income" ? (
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
      </div>
    </div>
  );
}
