import Head from "next/head";
import { OverviewContent } from "@/components/pages/Overview";

import { useEffect, useState } from "react";

import axios from "axios";
import { User, UserRelation } from "@prisma/client";
import { Expenses } from "@/pages/api/get-expenses";
import { toRoundCurrencyString } from "@/platform/utils";

export default function Overview() {
  const [balance, setBalance] = useState<number>(0);
  const [debts, setDebts] = useState<any>({ owedBy: [], owedTo: [] });
  const [expenses, setExpenses] = useState<Expenses>([]);
  const [friends, setFriends] = useState<({ friend: User } & UserRelation)[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const friendsResult = await axios.get("/api/get-friends");
      setFriends(friendsResult.data);

      const expensesResult = await axios.get("/api/get-expenses");
      setExpenses(expensesResult.data);

      const balanceResult = await axios.get("/api/get-balance");
      setBalance(balanceResult.data);

      const debtsResult = await axios.get("/api/get-user-debts");
      setDebts(debtsResult.data);
    };
    void fetchData();
  }, []);

  const friendsWithBalances = aggregateBalances(debts.owedBy, debts.owedTo);

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <OverviewContent
        friends={friends}
        expenses={expenses}
        balance={balance}
      />
      {Object.entries(friendsWithBalances).map(([friendId, balance]) => (
        <div key={friendId}>
          {friendId} has a balance of {toRoundCurrencyString(balance, "USD")}
        </div>
      ))}
    </>
  );
}

function aggregateBalances(
  expensesOwedByUser1 = [],
  expensesPaidByOthersToUser1 = []
) {
  const balances = {};

  // Process amounts User 1 owes to others
  expensesOwedByUser1.forEach((expense) => {
    const userId = expense.user.id;
    const amount = expense.amount;

    if (!balances[userId]) {
      balances[userId] = 0;
    }
    // Subtracting since it's an amount User 1 owes
    balances[userId] -= amount;
  });

  // Process amounts others owe to User 1
  expensesPaidByOthersToUser1.forEach((expense) => {
    const userId = expense.user.id;
    const amount = expense.amount;

    if (!balances[userId]) {
      balances[userId] = 0;
    }
    // Adding since it's an amount owed to User 1
    balances[userId] += amount;
  });

  return balances;
}
