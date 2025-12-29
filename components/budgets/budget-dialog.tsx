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
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { useCreateBudget, useUpdateBudget } from "@/lib/hooks/use-budgets";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const budgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  month: z.number().min(1).max(12),
  year: z.number().min(CURRENT_YEAR - 10).max(CURRENT_YEAR + 10),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

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

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  React.useEffect(() => {
    if (open) {
      if (editingBudget) {
        form.reset({
          name: editingBudget.name,
          month: editingBudget.month,
          year: editingBudget.year,
        });
      } else {
        form.reset({
          name: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });
      }
    }
  }, [editingBudget, open, form]);

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      if (editingBudget) {
        await updateBudget.mutateAsync(data);
        toast.success("Budget updated successfully!");
      } else {
        await createBudget.mutateAsync(data);
        toast.success("Budget created successfully!");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save budget:", error);
      toast.error("Failed to save budget!");
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="py-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="b-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="b-name"
                    placeholder="e.g. Monthly Expenses"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="month"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="b-month">Month</FieldLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                    >
                      <SelectTrigger id="b-month" aria-invalid={fieldState.invalid}>
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
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="b-year">Year</FieldLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                    >
                      <SelectTrigger id="b-year" aria-invalid={fieldState.invalid}>
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
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
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