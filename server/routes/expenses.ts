import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
});

const createPostSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Coffee",
    amount: 100,
    description: "Coffee",
    date: "2021-01-01",
  },
  {
    id: 2,
    title: "Lunch",
    amount: 200,
    description: "Lunch",
    date: "2021-01-02",
  },
  {
    id: 3,
    title: "Dinner",
    amount: 300,
    description: "Dinner",
    date: "2021-01-03",
  },
];

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({
      expenses: fakeExpenses,
    });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    return c.json(expense);
  })
  .get("/total-spent", async (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0);
    return c.json({ total });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = c.req.param("id");
    const expense = fakeExpenses.find((e) => e.id === Number(id));
    if (!expense) {
      return c.notFound();
    }
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = c.req.param("id");
    const index = fakeExpenses.findIndex((e) => e.id === Number(id));
    if (index === -1) {
      return c.notFound();
    }
    const deletedExpense = fakeExpenses.splice(index, 1)[0];
    return c.json({ expense: deletedExpense });
  });
