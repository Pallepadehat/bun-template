import type { z } from "zod";
import { db } from "../../db/db";
import type { expenseSchema } from "../../sharedTypes/schema";

export async function getExpenses() {
  return await db.expense.findMany();
}

export async function createExpenses(expenses: z.infer<typeof expenseSchema>) {
  return await db.expense.create({ data: expenses });
}

export async function deleteExpense(id: number) {
  return await db.expense.delete({ where: { id } });
}

export async function getExpense(id: number) {
  return await db.expense.findUnique({ where: { id } });
}

export async function getTotalSpent() {
  const expenses = await getExpenses();
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}
