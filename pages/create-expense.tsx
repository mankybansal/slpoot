import Head from "next/head";
import { CreateExpenseContent } from "@/components/pages/CreateExpense";
import { faker } from "@faker-js/faker";

export type User = {
  id: string;
  name: string;
  email: string;
};

const me = {
  id: "1",
  name: "Mayank Bansal",
  email: "john.doe@sploot.finance",
};

const otherUsers: User[] = [
  {
    id: "2",
    name: "Aditya Walvekar",
    email: "a.w@sploot.finance",
  },
  {
    id: "3",
    name: "Manish Shetty",
    email: "m.s@sploot.finance",
  },
  {
    id: "4",
    name: "Ileesha Sharma",
    email: "i.s@sploot.finance",
  },
  {
    id: "5",
    name: "Vaishnavi Kulkarni",
    email: "v.k@sploot.finance",
  },
  {
    id: "6",
    name: "Aakash Bansal",
    email: "a.b@sploot.finance",
  },
];

export default function CreateExpense() {
  const users = faker.helpers.arrayElements(
    otherUsers,
    Math.random() * otherUsers.length
  );

  return (
    <>
      <Head>
        <title>Create New Expense</title>
      </Head>
      <CreateExpenseContent users={[me, ...users]} />
    </>
  );
}
