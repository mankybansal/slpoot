// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CreateExpenseFormData } from "@/components/pages/CreateExpense";

export type Ledger = CreateExpenseFormData[];

const getLocalStorageLedger = () => {
  const ledger = localStorage.getItem("ledger");
  return ledger ? JSON.parse(ledger) : [];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ledger>
) {
  if (req.method === "GET") {
    const ledger = getLocalStorageLedger();
    return res.status(200).json(ledger);
  }
}
