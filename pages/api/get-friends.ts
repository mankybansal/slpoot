// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { User, UserRelation } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<({ friend: User } & UserRelation)[]>
) {
  if (req.method === "GET") {
    const friends = await prisma.userRelation.findMany({
      where: { userId: 1 },
      include: { friend: true },
    });
    return res.status(200).json(friends);
  }
}
