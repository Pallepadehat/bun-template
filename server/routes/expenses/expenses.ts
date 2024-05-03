import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { expenseSchema } from "../../sharedTypes/schema";
import {
  createExpenses,
  deleteExpense,
  getExpenses,
  getTotalSpent,
} from "./functions";

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    try {
      const expenses = await getExpenses();
      return c.json({
        expenses: expenses,
      });
    } catch (error) {
      console.error(error);
    }
  })
  .post("/", zValidator("json", expenseSchema), async (c) => {
    try {
      const expense = await c.req.valid("json");
      await createExpenses(expense);
      return c.json(expense);
    } catch (error) {
      console.error(error);
    }
  })
  .get("/total-expenses", async (c) => {
    try {
      const expenses = await getExpenses();
      return c.json({ total: expenses.length });
    } catch (error) {
      console.error(error);
    }
  })
  .get("/total-spent", async (c) => {
    try {
      const total = await getTotalSpent();
      return c.json({ total });
    } catch (error) {
      console.error(error);
    }
  })
  .get("/:id{[0-9]+}", async (c) => {
    try {
      const expenses = await getExpenses();
      const id = c.req.param("id");
      const expense = expenses.find((e) => e.id === Number(id));
      if (!expense) {
        return c.notFound();
      }
      return c.json(expense);
    } catch (error) {
      console.error(error);
    }
  })
  .delete("/:id{[0-9]+}", async (c) => {
    try {
      const expenses = await getExpenses();
      const id = c.req.param("id");
      const index = expenses.findIndex((e) => e.id === Number(id));
      if (index === -1) {
        return c.notFound();
      }
      const deletedExpense = deleteExpense(Number(id));
      return c.json({ expense: deletedExpense });
    } catch (error) {
      console.error(error);
    }
  });
