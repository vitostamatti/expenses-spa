import { insertExpenseSchema } from "./db/schema/expenseTable";

export const createExpenseSchema = insertExpenseSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export type CreateExpense = Zod.infer<typeof createExpenseSchema>;
