import Head from "next/head";
import { OverviewContent } from "@/components/pages/Overview";

export default function Overview() {
  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <OverviewContent />
    </>
  );
}
