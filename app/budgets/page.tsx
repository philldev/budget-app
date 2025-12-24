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
} from "lucide-react";
import { Budget } from "@/lib/types";
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
  DialogTrigger,
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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

// Mock initial data
const INITIAL_BUDGETS: Budget[] = [
  { id: "1", name: "Personal Q1", month: 1, year: 2024 },
  { id: "2", name: "Home Renovation", month: 3, year: 2024 },
  { id: "3", name: "Vacation Fund", month: 6, year: 2024 },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = React.useState<Budget[]>(INITIAL_BUDGETS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<Budget | null>(null);

  // Form State
  const [formData, setFormData] = React.useState<Omit<Budget, "id">>({
    name: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [filterYear, setFilterYear] = React.useState<string>("all");

  const resetForm = () => {
    setFormData({
      name: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    setEditingBudget(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleSave = () => {
    if (editingBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editingBudget.id ? { ...formData, id: b.id } : b,
        ),
      );
    } else {
      setBudgets((prev) => [
        ...prev,
        { ...formData, id: Math.random().toString(36).substr(2, 9) },
      ]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      month: budget.month,
      year: budget.year,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch = budget.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      filterYear === "all" || budget.year.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Manage your monthly budgets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Budget
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <InputGroup className="w-full sm:w-[300px]">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
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
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm border rounded-md border-dashed">
          No budgets found.
        </div>
      ) : (
        <ItemGroup>
          {filteredBudgets.map((budget) => (
            <Item key={budget.id} variant="outline" className="justify-between">
              <ItemMedia>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{budget.name}</ItemTitle>
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
                    <DropdownMenuItem onClick={() => handleEdit(budget)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(budget.id)}
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
              {editingBudget ? "Edit Budget" : "Create Budget"}
            </DialogTitle>
            <DialogDescription>
              {editingBudget
                ? "Make changes to your budget here."
                : "Add a new budget to your list."}
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
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Monthly Expenses"
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="month">Month</FieldLabel>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(val) =>
                      setFormData({ ...formData, month: parseInt(val) })
                    }
                  >
                    <SelectTrigger id="month">
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
                  <FieldLabel htmlFor="year">Year</FieldLabel>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(val) =>
                      setFormData({ ...formData, year: parseInt(val) })
                    }
                  >
                    <SelectTrigger id="year">
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
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">
                {editingBudget ? "Save changes" : "Create Budget"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
