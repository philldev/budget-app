"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Budget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCreateBudget, useUpdateBudget } from "@/lib/hooks/use-budgets";

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

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBudget?: Budget | null;
}

export function BudgetDialog({
  open,
  onOpenChange,
  editingBudget,
}: BudgetDialogProps) {
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget(editingBudget?.id || "");

  const [formData, setFormData] = React.useState<Omit<Budget, "id" | "userId">>({
    name: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  React.useEffect(() => {
    if (editingBudget) {
      setFormData({
        name: editingBudget.name,
        month: editingBudget.month,
        year: editingBudget.year,
      });
    } else {
      setFormData({
        name: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    }
  }, [editingBudget, open]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await updateBudget.mutateAsync(formData);
      } else {
        await createBudget.mutateAsync(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  const isPending = createBudget.isPending || updateBudget.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <form onSubmit={handleSave}>
          <FieldGroup className="py-2">
            <Field>
              <FieldLabel htmlFor="b-name">Name</FieldLabel>
              <Input
                id="b-name"
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
                <FieldLabel htmlFor="b-month">Month</FieldLabel>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(val) =>
                    setFormData({ ...formData, month: parseInt(val) })
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
                  value={formData.year.toString()}
                  onValueChange={(val) =>
                    setFormData({ ...formData, year: parseInt(val) })
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBudget ? "Save changes" : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
