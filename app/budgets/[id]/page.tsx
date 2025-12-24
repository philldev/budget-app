"use client";

import * as React from "react";
import Link from "next/link";
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

// Mock data
const MOCK_BUDGETS: Budget[] = [
  { id: "1", name: "Personal Q1", month: 1, year: 2024 },
  { id: "2", name: "Home Renovation", month: 3, year: 2024 },
  { id: "3", name: "Vacation Fund", month: 6, year: 2024 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    budgetId: "1",
    name: "Salary",
    amount: 5000,
    type: "income",
    date: "2024-01-01",
  },
  {
    id: "t2",
    budgetId: "1",
    name: "Rent",
    amount: 1500,
    type: "expense",
    date: "2024-01-02",
  },
  {
    id: "t3",
    budgetId: "1",
    name: "Groceries",
    amount: 400,
    type: "expense",
    date: "2024-01-05",
  },
];

export default function BudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const budgetId = resolvedParams.id;

  const [budget] = React.useState<Budget | undefined>(
    MOCK_BUDGETS.find((b) => b.id === budgetId),
  );

  const [transactions, setTransactions] = React.useState<Transaction[]>(
    MOCK_TRANSACTIONS.filter((t) => t.budgetId === budgetId),
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState<
    Omit<Transaction, "id" | "budgetId" | "date">
  >({
    name: "",
    amount: 0,
    type: "expense",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
      type: "expense",
    });
    setEditingTransaction(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleSave = () => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? { ...t, ...formData } : t,
        ),
      );
    } else {
      setTransactions((prev) => [
        ...prev,
        {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          budgetId,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
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

  if (!budget) {
    return <div className="p-6">Budget not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/budgets" className="text-sm font-medium">
            Back to Budgets
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{budget.name}</h1>
            <p className="text-muted-foreground">
              Detailed view of your transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <InputGroup className="w-full sm:w-[300px]">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm border rounded-md border-dashed">
          No transactions found.
        </div>
      ) : (
        <ItemGroup>
          {filteredTransactions.map((transaction) => (
            <Item
              key={transaction.id}
              id={`transaction-${transaction.id}`}
              variant="outline"
              className={cn(
                "justify-between transition-all duration-500",
                highlightedId === transaction.id &&
                  "bg-destructive/10 ring-2 ring-destructive/50 border-destructive/50",
              )}
            >
              <ItemMedia>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    transaction.type === "income"
                      ? "bg-emerald-500/10"
                      : "bg-destructive/10",
                  )}
                >
                  {transaction.type === "income" ? (
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{transaction.name}</ItemTitle>
                <ItemDescription>{transaction.date}</ItemDescription>
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
          ))}
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
              <Button size="sm" type="submit">
                {editingTransaction ? "Save changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
