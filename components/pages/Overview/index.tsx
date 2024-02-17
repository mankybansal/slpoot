import { Flex } from "@/components/Flex";
import { useRouter } from "next/router";
import { routes } from "@/routes";
import { Button } from "@chakra-ui/react";
import Text from "@/components/Text";
import {
  Expense,
  ExpenseOwedBy,
  ExpensePaidBy,
  User,
  UserRelation,
} from "@prisma/client";
import { Expenses } from "@/pages/api/get-expenses";
import { Currency, toRoundCurrencyString } from "@/platform/utils";
import { DateTime } from "luxon";

export const OverviewContent = ({
  friends,
  expenses,
  balance,
}: {
  friends: ({ friend: User } & UserRelation)[];
  expenses: Expenses;
  balance: number;
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

      <Text my={"32px"}>Balance: {toRoundCurrencyString(balance, "USD")}</Text>

      <Flex column mt={"32px"}>
        <Text bold>Expenses</Text>
        {expenses.map(
          (
            r: {
              expensesPaidBy: ExpensePaidBy[];
              expensesOwedBy: ExpenseOwedBy[];
            } & Expense
          ) => (
            <Flex
              column
              key={r.id}
              maxW={"400px"}
              flex={1}
              mt={"8px"}
              bg={"#eee"}
              p={"16px"}
            >
              <Flex justify={"space-between"}>
                <Text>{r.description}</Text>
                <Text bold>
                  {toRoundCurrencyString(r.totalAmount, r.currency as Currency)}
                </Text>
              </Flex>
              <Text>{DateTime.fromISO(r.date).toFormat("MM/dd/yyyy")}</Text>
              Involved: {r.expensesOwedBy.map((o) => o.userId).join(", ")}
            </Flex>
          )
        )}
      </Flex>
    </Flex>
  );
};
