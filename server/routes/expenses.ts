import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../db";
import { expenseTable, insertExpenseSchema } from "../db/schema/expenseTable";
import { desc, eq, sum, and } from "drizzle-orm";
import { createExpenseSchema } from "../types";

export const expensesRoutes = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .orderBy(desc(expenseTable.createdAt))
      .limit(100);
    return c.json({ expenses });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const data = await c.req.valid("json");
    const user = c.var.user;

    const validatedExpense = insertExpenseSchema.parse({
      ...data,
      userId: user.id,
    });

    const expense = await db
      .insert(expenseTable)
      .values(validatedExpense)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(expense);
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;
    const total = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);
    return c.json(total);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const expense = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .then((res) => res[0]);
    if (!expense) return c.notFound();
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const expense = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0]);
    if (!expense) return c.notFound();
    return c.json(expense);
  });
