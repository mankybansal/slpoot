import { Flex } from "@/components/Flex";
import { useRouter } from "next/router";
import { routes } from "@/routes";
import { Button } from "@chakra-ui/react";

export const OverviewContent = () => {
  const router = useRouter();
  return (
    <Flex>
      <Button onClick={() => router.push(routes.createExpense)}>
        Create expense
      </Button>
    </Flex>
  );
};
