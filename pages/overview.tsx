import Head from "next/head";
import { OverviewContent } from "@/components/pages/Overview";

import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import axios from "axios";
import { User, UserRelation } from "@prisma/client";

export default function Overview() {
  const [friends, setFriends] = useState<({ friend: User } & UserRelation)[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/get-friends");
      setFriends(result.data);
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
