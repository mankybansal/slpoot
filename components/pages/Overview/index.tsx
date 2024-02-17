import { Flex } from "@/components/Flex";
import { useRouter } from "next/router";
import { routes } from "@/routes";
import { Button } from "@chakra-ui/react";
import Text from "@/components/Text";
import { User, UserRelation } from "@prisma/client";

export const OverviewContent = ({
  friends,
}: {
  friends: ({ friend: User } & UserRelation)[];
}) => {
  const router = useRouter();

  return (
    <Flex column>
      <Button onClick={() => router.push(routes.createExpense)}>
        Create expense
      </Button>

      <Flex column mt={"32px"}>
        <Text bold>Friends</Text>
        {friends.map((r: any) => (
          <div key={r.id}>{r.friend.firstName}</div>
        ))}
      </Flex>
    </Flex>
  );
};
