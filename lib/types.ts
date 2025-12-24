export interface Budget {
  id: string;
  name: string;
  month: number;
  year: number;
}

export interface Transaction {
  id: string;
  budgetId: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}
