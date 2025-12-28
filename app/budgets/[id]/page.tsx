"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
} from "lucide-react";
import { Budget, Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGetBudget, useUpdateBudget, useDeleteBudget } from "@/lib/hooks/use-budgets";
import {
  useGetTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/lib/hooks/use-transactions";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserNav } from "@/components/auth/user-nav";

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

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

export default function BudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const budgetId = resolvedParams.id;

  const { data: budget, isLoading: isLoadingBudget, isError: isErrorBudget } = useGetBudget(budgetId);
  const { data: transactions = [], isLoading: isLoadingTransactions } = useGetTransactions(budgetId);
  
  const updateBudget = useUpdateBudget(budgetId);
  const deleteBudget = useDeleteBudget();
  
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

  const updateTransaction = useUpdateTransaction(editingTransaction?.id || "");

  // Form State
  const [formData, setFormData] = React.useState<
    Omit<Transaction, "id" | "budgetId" | "date">
  >({
    name: "",
    amount: 0,
    type: "expense",
    category: "",
  });

  const [budgetFormData, setBudgetFormData] = React.useState<Omit<Budget, "id" | "userId">>({
    name: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Update budget form when data arrives
  React.useEffect(() => {
    if (budget) {
      setBudgetFormData({
        name: budget.name,
        month: budget.month,
        year: budget.year,
      });
    }
  }, [budget]);

  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
      type: "expense",
      category: "",
    });
    setEditingTransaction(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleSave = async () => {
    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync(formData);
      } else {
        await createTransaction.mutateAsync({
          ...formData,
          budgetId,
          date: new Date().toISOString().split("T")[0],
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
    });
    setIsDialogOpen(true);
  };

  const handleSaveBudget = async () => {
    try {
      await updateBudget.mutateAsync(budgetFormData);
      setIsBudgetDialogOpen(false);
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleDeleteBudget = async () => {
    if (confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget.mutateAsync(budgetId);
        router.push("/budgets");
      } catch (error) {
        console.error("Failed to delete budget:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync({ id, budgetId });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              {MONTHS[budget.month - 1]} {budget.year} • Detailed view of your transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {session?.user && <UserNav user={session.user} />}
            <Button onClick={() => setIsDialogOpen(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Budget Options</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsBudgetDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Budget
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDeleteBudget}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Budget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
          <div className="px-4 flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-background shadow-xs">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-[10px] mb-1 uppercase tracking-wider font-bold text-muted-foreground">
                  Current Balance
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  $ {balance.toLocaleString()}
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
                    ${totalIncome.toLocaleString()}
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
                    ${totalExpense.toLocaleString()}
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
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-sm font-bold">
                      ${highestExpenseTransaction.amount.toLocaleString()}
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
            const perimeter = 2 * (width - 2 * rx) + 2 * (height - 2 * rx) + 2 * Math.PI * rx;
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
                          transform: "rotate(-90deg)"
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
                  {transaction.category} • {transaction.date}
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
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
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
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          )})}
        </ItemGroup>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? "Make changes to your transaction here."
                : "Add a new transaction to this budget."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel htmlFor="t-name">Name</FieldLabel>
                <Input
                  id="t-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Salary, Groceries"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="t-category">Category</FieldLabel>
                <Input
                  id="t-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g. Food, Rent, Income"
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="t-amount">Amount</FieldLabel>
                  <Input
                    id="t-amount"
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="t-type">Type</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(val: "income" | "expense") =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger id="t-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={createTransaction.isPending || updateTransaction.isPending}>
                {(createTransaction.isPending || updateTransaction.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTransaction ? "Save changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget details below.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveBudget();
            }}
          >
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel htmlFor="b-name">Name</FieldLabel>
                <Input
                  id="b-name"
                  value={budgetFormData.name}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, name: e.target.value })
                  }
                  placeholder="e.g. Monthly Expenses"
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="b-month">Month</FieldLabel>
                  <Select
                    value={budgetFormData.month.toString()}
                    onValueChange={(val) =>
                      setBudgetFormData({ ...budgetFormData, month: parseInt(val) })
                    }
                  >
                    <SelectTrigger id="b-month">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="b-year">Year</FieldLabel>
                  <Select
                    value={budgetFormData.year.toString()}
                    onValueChange={(val) =>
                      setBudgetFormData({ ...budgetFormData, year: parseInt(val) })
                    }
                  >
                    <SelectTrigger id="b-year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsBudgetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={updateBudget.isPending}>
                {updateBudget.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
