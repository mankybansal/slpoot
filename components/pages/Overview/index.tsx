import { Flex } from "@/components/Flex";
import { useRouter } from "next/router";
import { routes } from "@/routes";
import { Button } from "@chakra-ui/react";

import { sql } from "@vercel/postgres";

export const OverviewContent = ({ friends }: any) => {
  const router = useRouter();

  return (
    <Flex>
      <Button onClick={() => router.push(routes.createExpense)}>
        Create expense
      </Button>

      {friends.map((r: any) => (
        <div key={r.id}>{r.id}</div>
      ))}
    </Flex>
  );
};
