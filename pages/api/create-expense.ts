// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CreateExpenseFormData } from "@/components/pages/CreateExpense";

type Data = {
  success: boolean;
};



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const data: CreateExpenseFormData = req.body;
    console.log(data);
    return res.status(200).json({ success: true });
  }
  res.status(400).json({ success: true });
}
