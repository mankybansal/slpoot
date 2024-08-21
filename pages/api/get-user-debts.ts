// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

async function fetchUserDebts(userId: number) {
  // Fetch how much and to whom user 1 owes money
  const owesTo = await prisma.expenseOwedBy.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      expense: {
        select: {
          description: true,
          totalAmount: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  // Fetch how much and from whom user 1 is owed money
  const owedBy = await prisma.expensePaidBy.findMany({
    where: {
      expense: {
        userId: userId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      expense: {
        select: {
          id: true,
          description: true,
          totalAmount: true,
        },
      },
    },
  });

  return { owesTo, owedBy };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const debts = await fetchUserDebts(1);
    return res.status(200).json(debts);
  }
}
