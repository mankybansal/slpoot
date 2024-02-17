import Head from "next/head";
import { OverviewContent } from "@/components/pages/Overview";

import { useEffect, useState } from "react";

import axios from "axios";
import { User, UserRelation } from "@prisma/client";
import { Expenses } from "@/pages/api/get-expenses";

export default function Overview() {
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
    };
    void fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <OverviewContent friends={friends} expenses={expenses} />
    </>
  );
}
