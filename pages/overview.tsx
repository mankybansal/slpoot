import Head from "next/head";
import { OverviewContent } from "@/components/pages/Overview";
import { sql } from "@vercel/postgres";
import { useEffect, useState } from "react";

export default function Overview() {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { rows } =
        await sql`SELECT * from user_relations where user_id=${1}`;
      setFriends(rows);
    };
    void fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <OverviewContent friends={friends} />
    </>
  );
}
