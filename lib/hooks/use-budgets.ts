import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Budget, NewBudget } from "@/lib/types";

export function useGetBudgets() {
  return useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");
      return response.json();
    },
  });
}

export function useGetBudget(id: string) {
  return useQuery<Budget>({
    queryKey: ["budgets", id],
    queryFn: async () => {
      const response = await fetch(`/api/budgets/${id}`);
      if (!response.ok) throw new Error("Failed to fetch budget");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBudget: Omit<NewBudget, "userId">) => {
      const response = await fetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify(newBudget),
      });
      if (!response.ok) throw new Error("Failed to create budget");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useUpdateBudget(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<NewBudget, "userId">>) => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update budget");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets", id] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete budget");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
