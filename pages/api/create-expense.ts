// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CreateExpenseFormData } from "@/components/pages/CreateExpense";
import prisma from "@/lib/prisma";
import { DateTime } from "luxon";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const data: CreateExpenseFormData = req.body;

    console.log("here");

    if (!data.totalAmount) {
      return res.status(400).json({ success: false });
    }

    console.log("here");

    const expense = await prisma.expense.create({
      data: {
        userId: 1,
        totalAmount: data.totalAmount,
        description: data.description,
        currency: data.currency,
        date: DateTime.fromISO(data.date).toString(),
        method: data.method,
      },
    });

    console.log("here");

    await Promise.all(
      data.paidBySplits.map((split) =>
        prisma.expensePaidBy.create({
          data: {
            expenseId: expense.id, // Assuming `expenseId` is part of your split object
            userId: split.userId,
            amount: split.amount,
          },
        })
      )
    );

    await Promise.all(
      data.owedBySplits.map((split) =>
        prisma.expenseOwedBy.create({
          data: {
            expenseId: expense.id,
            userId: split.userId,
            amount: split.amount,
          },
        })
      )
    );

    return res.status(200).json({ success: true });
  }
  res.status(400).json({ success: true });
}
