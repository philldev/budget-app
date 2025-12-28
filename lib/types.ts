import { InferSelectModel } from "drizzle-orm";
import * as schema from "./db/schema";

export type Budget = InferSelectModel<typeof schema.budgets>;
export type Transaction = InferSelectModel<typeof schema.transactions>;

export type User = InferSelectModel<typeof schema.user>;
export type Session = InferSelectModel<typeof schema.session>;

export type NewBudget = typeof schema.budgets.$inferInsert;
export type NewTransaction = typeof schema.transactions.$inferInsert;