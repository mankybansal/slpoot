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
import { useMe } from "@/pages/_app";

export const OverviewContent = ({
  friends,
  expenses,
  balance,
}: {
  friends: ({ friend: User } & UserRelation)[];
  expenses: Expenses;
  balance: number;
}) => {
  const { me } = useMe();
  const router = useRouter();

  return (
    <Flex column maxW={"800px"}>
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

      <Flex column my={"32px"}>
        <Text bold>Expenses</Text>
        {expenses.map(
          (
            r: {
              expensesPaidBy: ExpensePaidBy[];
              expensesOwedBy: ExpenseOwedBy[];
            } & Expense
          ) => {
            const paidBy = r.expensesPaidBy.filter((epb) => epb.amount > 0);
            const paidByNames = paidBy
              .map((pb) => (pb.userId === me.id ? "You" : pb.user.firstName))
              .join(", ");
            return (
              <Flex
                key={r.id}
                align={"center"}
                borderTop={"1px solid #eee"}
                _last={{ borderBottom: "1px solid #eee" }}
              >
                <Text>{DateTime.fromISO(r.date).toFormat("MMM dd")}</Text>
                <Flex column maxW={"400px"} flex={1} ml={"8px"} p={"16px"}>
                  <Flex justify={"space-between"}>
                    <Text>{r.description}</Text>
                    <Text bold></Text>
                  </Flex>
                  <Flex>
                    <Text bold mr={"4px"}>
                      {paidByNames}
                    </Text>{" "}
                    paid
                    <Text ml={"4px"} bold>
                      {toRoundCurrencyString(
                        r.totalAmount,
                        r.currency as Currency
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            );
          }
        )}
      </Flex>
    </Flex>
  );
};
