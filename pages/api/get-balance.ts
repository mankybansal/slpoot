// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<number>
) {
  if (req.method === "GET") {
    try {
      const totalCredits = await prisma.expensePaidBy.findMany({
        where: { userId: 1 },
      });

      const totalDebits = await prisma.expenseOwedBy.findMany({
        where: { userId: 1 },
      });

      const balance =
        totalCredits.reduce((acc, credit) => acc + credit.amount, 0) -
        totalDebits.reduce((acc, debit) => acc + debit.amount, 0);

      return res.status(200).json(balance);
    } catch (error) {
      return res.status(200).json(0);
    }
  }
}
