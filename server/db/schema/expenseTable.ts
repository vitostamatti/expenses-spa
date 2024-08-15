import {
  date,
  index,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenseTable = pgTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (expense) => {
    return {
      userIdIndex: index("user_id_idx").on(expense.userId),
    };
  }
);

export const insertExpenseSchema = createInsertSchema(expenseTable, {
  title: z.string().min(3),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Amount is not valid" }),
});

export const selectUserSchema = createSelectSchema(expenseTable);
