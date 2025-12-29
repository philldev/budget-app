"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from "@/components/ui/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TransactionIcon } from "./transaction-icon";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  totalIncome: number;
  totalExpense: number;
  highlightedId: string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  loadingItems?: number;
}

export function TransactionList({
  transactions,
  isLoading,
  totalIncome,
  totalExpense,
  highlightedId,
  onEdit,
  onDelete,
  loadingItems = 5,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <ItemGroup>
        {Array.from({ length: loadingItems }).map((_, i) => (
          <Item key={i} variant="outline" size="xs" className="justify-between">
            <ItemMedia>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </ItemMedia>
            <ItemContent>
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </ItemContent>
            <div className="flex flex-col items-end mr-4">
              <Skeleton className="h-5 w-24" />
            </div>
          </Item>
        ))}
      </ItemGroup>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm border rounded-md border-dashed">
        No transactions found.
      </div>
    );
  }

  return (
    <ItemGroup>
      {transactions.map((transaction) => {
        const totalForType =
          transaction.type === "income" ? totalIncome : totalExpense;
        const percentage =
          totalForType > 0 ? (transaction.amount / totalForType) * 100 : 0;

        return (
          <Item
            key={transaction.id}
            id={`transaction-${transaction.id}`}
            variant="outline"
            size="xs"
            className={cn(
              "justify-between transition-all duration-500",
              highlightedId === transaction.id &&
                "bg-destructive/10 ring-2 ring-destructive/50 border-destructive/50",
            )}
          >
            <ItemMedia>
              <TransactionIcon type={transaction.type} percentage={percentage} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{transaction.name}</ItemTitle>
              <ItemDescription>{transaction.category}</ItemDescription>
            </ItemContent>
            <div className="flex flex-col items-end mr-4">
              <span
                className={cn(
                  "text-sm font-semibold",
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : "text-destructive",
                )}
              >
                {transaction.type === "income" ? "+" : "-"}Rp
                {transaction.amount.toLocaleString("id-ID")}
              </span>
            </div>

            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(transaction)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        );
      })}
    </ItemGroup>
  );
}
