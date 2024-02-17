// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { User, UserRelation } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | null>
) {
  if (req.method === "GET") {
    const me = await prisma.user.findUnique({
      where: { id: 1 },
    });
    return res.status(200).json(me);
  }
}
