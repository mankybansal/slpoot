import Head from "next/head";
import { CreateExpenseContent } from "@/components/pages/CreateExpense";

import { useEffect, useState } from "react";
import { User, UserRelation } from "@prisma/client";

import { useMe } from "@/pages/_app";
import axios from "axios";
import { faker } from "@faker-js/faker";

export default function CreateExpense() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<({ friend: User } & UserRelation)[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/get-friends");
      setFriends(result.data);
    };
    fetchData().then(() => setLoading(false));
  }, []);

  const { me } = useMe();

  if (loading) {
    return <div>Loading...</div>;
  }

  const users = friends.map(({ friend }) => friend);
  const selectedUsers = faker.helpers.arrayElements(users);

  return (
    <>
      <Head>
        <title>Create New Expense</title>
      </Head>
      <CreateExpenseContent users={[me, ...selectedUsers]} />
    </>
  );
}
