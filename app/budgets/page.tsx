"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wallet,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Budget } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  useGetBudgets,
  useDeleteBudget,
} from "@/lib/hooks/use-budgets";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserNav } from "@/components/auth/user-nav";
import { BudgetDialog } from "@/components/budgets/budget-dialog";
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

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

export default function BudgetsPage() {
  const { data: session } = authClient.useSession();
  const { data: budgets = [], isLoading, isError } = useGetBudgets();
  const deleteBudget = useDeleteBudget();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<Budget | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [budgetToDelete, setBudgetToDelete] = React.useState<string | null>(null);

  const [filterYear, setFilterYear] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("date-desc");

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    try {
      await deleteBudget.mutateAsync(budgetToDelete);
      setBudgetToDelete(null);
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const filteredBudgets = budgets
    .filter((budget) => {
      const matchesSearch = budget.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesYear =
        filterYear === "all" || budget.year.toString() === filterYear;
      return matchesSearch && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      }
      if (sortBy === "date-asc") {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-6 space-y-4 max-w-5xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground text-xs">
            Manage your monthly budgets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingBudget(null);
              setIsDialogOpen(true);
            }}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Create Budget
          </Button>
          {session?.user && <UserNav user={session.user} />}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <InputGroup className="w-full sm:w-[300px]">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search budgets..."
            className="text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Year" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-destructive text-sm border rounded-md border-dashed border-destructive/50">
          Failed to load budgets. Please try again.
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm border rounded-md border-dashed">
          No budgets found.
        </div>
      ) : (
        <ItemGroup>
          {filteredBudgets.map((budget) => (
            <Item
              key={budget.id}
              variant="outline"
              size="xs"
              className="justify-between"
            >
              <ItemMedia>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <Link
                    href={`/budgets/${budget.id}`}
                    className="hover:underline"
                  >
                    {budget.name}
                  </Link>
                </ItemTitle>
                <ItemDescription>
                  {MONTHS[budget.month - 1]} {budget.year}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/budgets/${budget.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(budget)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(budget.id)}
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

      <BudgetDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        editingBudget={editingBudget} 
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleteBudget.isPending}
        title="Delete Budget?"
        description="Are you sure you want to delete this budget? All related transactions will be removed. This action cannot be undone."
      />
    </div>
  );
}