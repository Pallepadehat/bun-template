import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number(),
  title: z.string(),
  amount: z.number(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
