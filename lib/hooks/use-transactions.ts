import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction, NewTransaction } from "@/lib/types";

export function useGetTransactions(budgetId: string) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", { budgetId }],
    queryFn: async () => {
      const response = await fetch(`/api/budgets/${budgetId}/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!budgetId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransaction: NewTransaction) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", { budgetId: variables.budgetId }],
      });
    },
  });
}

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<NewTransaction>) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update transaction");
      return response.json();
    },
    onSuccess: (data: Transaction) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", { budgetId: data.budgetId }],
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, budgetId }: { id: string; budgetId: string }) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", { budgetId: variables.budgetId }],
      });
    },
  });
}
