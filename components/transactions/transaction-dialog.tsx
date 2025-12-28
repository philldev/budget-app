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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/lib/hooks/use-transactions";

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
  const [formData, setFormData] = React.useState<
    Omit<Transaction, "id" | "budgetId" | "date">
  >({
    name: "",
    amount: 0,
    type: "expense",
    category: "",
  });

  React.useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
      });
    } else {
      setFormData({
        name: "",
        amount: 0,
        type: "expense",
        category: "",
      });
    }
  }, [editingTransaction, open]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync(formData);
        onOpenChange(false);
      } else {
        await createTransaction.mutateAsync({
          ...formData,
          budgetId,
          date: new Date().toISOString().split("T")[0],
        });

        if (!addAnother) {
          onOpenChange(false);
        } else {
          setFormData((prev) => ({
            ...prev,
            name: "",
            amount: 0,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to save transaction:", error);
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
        <form onSubmit={handleSave}>
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
                <NumericFormat
                  id="t-amount"
                  customInput={Input}
                  value={formData.amount === 0 ? "" : formData.amount}
                  onValueChange={(values) => {
                    setFormData({
                      ...formData,
                      amount: values.floatValue || 0,
                    });
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  placeholder="Rp 0"
                  decimalScale={2}
                  fixedDecimalScale={false}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="t-type">Type</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={formData.type === "expense" ? "default" : "outline"}
                    size="sm"
                    className="h-9 gap-1.5"
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                  >
                    <TrendingDown className="h-3.5 w-3.5" />
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === "income" ? "default" : "outline"}
                    size="sm"
                    className="h-9 gap-1.5"
                    onClick={() => setFormData({ ...formData, type: "income" })}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Income
                  </Button>
                </div>
              </Field>
            </div>
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
