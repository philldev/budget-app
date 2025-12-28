import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  budgetId: text("budget_id")
    .notNull()
    .references(() => budgets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
});
