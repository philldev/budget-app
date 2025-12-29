"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useGetBudget,
  useDeleteBudget,
} from "@/lib/hooks/use-budgets";
import {
  useGetTransactions,
  useDeleteTransaction,
} from "@/lib/hooks/use-transactions";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserNav } from "@/components/auth/user-nav";
import { BudgetDialog } from "@/components/budgets/budget-dialog";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const budgetId = resolvedParams.id;

  const {
    data: budget,
    isLoading: isLoadingBudget,
    isError: isErrorBudget,
  } = useGetBudget(budgetId);
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactions(budgetId);

  const deleteBudget = useDeleteBudget();
  const deleteTransaction = useDeleteTransaction();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string>("date-desc");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

  const [isDeleteBudgetDialogOpen, setIsDeleteBudgetDialogOpen] = React.useState(false);
  const [isDeleteTransactionDialogOpen, setIsDeleteTransactionDialogOpen] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<string | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleConfirmDeleteBudget = async () => {
    try {
      await deleteBudget.mutateAsync(budgetId);
      router.push("/budgets");
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const handleDeleteTransactionClick = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteTransactionDialogOpen(true);
  };

  const handleConfirmDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction.mutateAsync({ id: transactionToDelete, budgetId });
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const filteredTransactions = transactions
    .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      }
      if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "type-asc") {
        if (a.type === b.type) return 0;
        return a.type === "income" ? -1 : 1;
      }
      if (sortBy === "type-desc") {
        if (a.type === b.type) return 0;
        return a.type === "expense" ? -1 : 1;
      }
      return 0;
    });

  // Summary Calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const highestExpenseTransaction = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (max, t) => (t.amount > (max?.amount || 0) ? t : max),
      null as Transaction | null,
    );

  const scrollToTransaction = (id: string) => {
    const element = document.getElementById(`transaction-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedId(id);
      setTimeout(() => setHighlightedId(null), 2000);
    }
  };

  if (isLoadingBudget) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isErrorBudget || !budget) {
    return <div className="p-6">Budget not found or failed to load.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-4 max-w-5xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/budgets" className="text-sm font-medium">
            Back to Budgets
          </Link>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{budget.name}</h1>
            <p className="text-muted-foreground text-xs">
              {MONTHS[budget.month - 1]} {budget.year} • Detailed view of your
              transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingTransaction(null);
                setIsDialogOpen(true);
              }}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                <DropdownMenuLabel>Budget Options</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsBudgetDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Budget
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteBudgetDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Budget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {session?.user && <UserNav user={session.user} />}
          </div>
        </div>
      </div>

      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
          <div className="px-4 flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-background shadow-xs">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-[10px] mb-1 uppercase tracking-wider font-bold text-muted-foreground">
                  Current Balance
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Rp {balance.toLocaleString("id-ID")}
                </h2>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="h-10 hidden sm:block"
            />

            <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  Income
                </p>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-sm font-bold">
                    Rp {totalIncome.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  Expense
                </p>
                <div className="flex items-center gap-1.5 text-destructive">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span className="text-sm font-bold">
                    Rp {totalExpense.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              {highestExpenseTransaction && (
                <button
                  onClick={() =>
                    scrollToTransaction(highestExpenseTransaction.id)
                  }
                  className="text-left group outline-none"
                >
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1 transition-colors group-hover:text-foreground">
                    Highest
                  </p>
                  <div className="flex items-center gap-1.5 text-destructive leading-none">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span className="text-sm font-bold">
                      Rp {highestExpenseTransaction.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 truncate max-w-[100px] mt-0.5 transition-colors group-hover:text-muted-foreground">
                    {highestExpenseTransaction.name}
                  </p>
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <InputGroup className="w-full sm:w-[300px]">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search transactions..."
            className="text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="amount-desc">Amount: High-Low</SelectItem>
            <SelectItem value="amount-asc">Amount: Low-High</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
            <SelectItem value="type-asc">Type: Income First</SelectItem>
            <SelectItem value="type-desc">Type: Expense First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingTransactions ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm border rounded-md border-dashed">
          No transactions found.
        </div>
      ) : (
        <ItemGroup>
          {filteredTransactions.map((transaction) => {
            const totalForType =
              transaction.type === "income" ? totalIncome : totalExpense;
            const percentage =
              totalForType > 0 ? (transaction.amount / totalForType) * 100 : 0;

            const width = 28;
            const height = 28;
            const rx = 8;
            const perimeter =
              2 * (width - 2 * rx) + 2 * (height - 2 * rx) + 2 * Math.PI * rx;
            const offset = perimeter - (percentage / 100) * perimeter;

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
                          transaction.type === "income"
                            ? "text-emerald-500"
                            : "text-destructive",
                        )}
                      />
                    </svg>
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg z-10",
                        transaction.type === "income"
                          ? "bg-emerald-500/10"
                          : "bg-destructive/10",
                      )}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{transaction.name}</ItemTitle>
                  <ItemDescription>
                    {transaction.category}
                  </ItemDescription>
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
                      <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteTransactionClick(transaction.id)}
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
      )}

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingTransaction={editingTransaction}
        budgetId={budgetId}
      />

      <BudgetDialog
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
        editingBudget={budget}
      />

      <DeleteConfirmDialog
        open={isDeleteBudgetDialogOpen}
        onOpenChange={setIsDeleteBudgetDialogOpen}
        onConfirm={handleConfirmDeleteBudget}
        isLoading={deleteBudget.isPending}
        title="Delete Budget?"
        description="Are you sure you want to delete this budget? All related transactions will be removed. This action cannot be undone."
      />

      <DeleteConfirmDialog
        open={isDeleteTransactionDialogOpen}
        onOpenChange={setIsDeleteTransactionDialogOpen}
        onConfirm={handleConfirmDeleteTransaction}
        isLoading={deleteTransaction.isPending}
        title="Delete Transaction?"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}