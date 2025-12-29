"use client";

import * as React from "react";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Transaction } from "@/lib/types";
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
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/lib/hooks/use-transactions";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const transactionSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required").max(30, "Category is too long"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTransaction?: Transaction | null;
  budgetId: string;
}

export function TransactionDialog({
  open,
  onOpenChange,
  editingTransaction,
  budgetId,
}: TransactionDialogProps) {
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction(editingTransaction?.id || "");

  const [addAnother, setAddAnother] = React.useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      type: "expense",
      category: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (editingTransaction) {
        form.reset({
          name: editingTransaction.name,
          amount: editingTransaction.amount,
          type: editingTransaction.type,
          category: editingTransaction.category,
        });
      } else {
        form.reset({
          name: "",
          amount: 0,
          type: "expense",
          category: "",
        });
      }
    }
  }, [editingTransaction, open, form]);

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync(data);
        onOpenChange(false);
        toast.success("Transaction updated successfully!");
      } else {
        await createTransaction.mutateAsync({
          ...data,
          budgetId,
          date: new Date().toISOString().split("T")[0],
        });
        toast.success("Transaction created successfully!");

        if (!addAnother) {
          onOpenChange(false);
        } else {
          form.reset({
            ...data,
            name: "",
            amount: 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to save transaction:", error);
      toast.error("Failed to save transaction!");
    }
  };

  const isPending = createTransaction.isPending || updateTransaction.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="py-2">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Transaction Type</FieldLabel>
                  <ButtonGroup className="w-full">
                    <Button
                      type="button"
                      variant={field.value === "expense" ? "default" : "outline"}
                      className="flex-1 h-10 gap-2 text-sm"
                      onClick={() => field.onChange("expense")}
                    >
                      <TrendingDown className="size-4" />
                      Expense
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "income" ? "default" : "outline"}
                      className="flex-1 h-10 gap-2 text-sm"
                      onClick={() => field.onChange("income")}
                    >
                      <TrendingUp className="size-4" />
                      Income
                    </Button>
                  </ButtonGroup>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="t-name"
                    placeholder="e.g. Salary, Groceries"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-category">Category</FieldLabel>
                  <Input
                    {...field}
                    id="t-category"
                    placeholder="e.g. Food, Rent, Income"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-amount">Amount</FieldLabel>
                  <NumericFormat
                    id="t-amount"
                    customInput={Input}
                    value={field.value === 0 ? "" : field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue || 0);
                    }}
                    onBlur={field.onBlur}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    placeholder="Rp 0"
                    decimalScale={2}
                    fixedDecimalScale={false}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
          {!editingTransaction && (
            <div className="flex items-center space-x-2 px-1 mb-4">
              <Checkbox
                id="add-another"
                checked={addAnother}
                onCheckedChange={(checked) => setAddAnother(!!checked)}
              />
              <Label
                htmlFor="add-another"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add another
              </Label>
            </div>
          )}
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
              {editingTransaction ? "Save changes" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}