// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { Expense, ExpenseOwedBy, ExpensePaidBy } from "@prisma/client";

export type Expenses = ({
  expensesPaidBy: ExpensePaidBy[];
  expensesOwedBy: ExpenseOwedBy[];
} & Expense)[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Expenses>
) {
  if (req.method === "GET") {
    try {
      const expenses = await prisma.expense.findMany({
        where: { userId: 1 },
        include: {
          expensesPaidBy: true,
          expensesOwedBy: true,
        },
      });

      return res.status(200).json(expenses);
    } catch (error) {
      return res.status(200).json([]);
    }
  }
}
