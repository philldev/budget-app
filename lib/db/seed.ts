import { db } from "./index";
import { budgets, transactions, user } from "./schema";
import { createId } from "@paralleldrive/cuid2";

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(transactions);
  await db.delete(budgets);
  await db.delete(user);

  // Seed User
  const dummyUserId = createId();
  await db.insert(user).values({
    id: dummyUserId,
    name: "Seed User",
    email: "seed@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Seed Budgets
  const budgetData = [
    { id: createId(), name: "Personal Q1", month: 1, year: 2024, userId: dummyUserId },
    { id: createId(), name: "Home Renovation", month: 3, year: 2024, userId: dummyUserId },
    { id: createId(), name: "Vacation Fund", month: 6, year: 2024, userId: dummyUserId },
  ];

  await db.insert(budgets).values(budgetData);
  console.log(`Inserted ${budgetData.length} budgets.`);

  // Seed Transactions for "Personal Q1"
  const personalQ1 = budgetData[0];
  const transactionData = [
    {
      id: createId(),
      budgetId: personalQ1.id,
      name: "Salary",
      amount: 5000,
      type: "income" as const,
      category: "Income",
      date: "2024-01-01",
    },
    {
      id: createId(),
      budgetId: personalQ1.id,
      name: "Rent",
      amount: 1500,
      type: "expense" as const,
      category: "Housing",
      date: "2024-01-02",
    },
    {
      id: createId(),
      budgetId: personalQ1.id,
      name: "Groceries",
      amount: 400,
      type: "expense" as const,
      category: "Food",
      date: "2024-01-05",
    },
  ];

  await db.insert(transactions).values(transactionData);
  console.log(`Inserted ${transactionData.length} transactions.`);

  console.log("Seeding completed successfully.");
}

main().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
