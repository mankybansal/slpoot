import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { routes } from "@/routes";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    void router.push(routes.overview);
  }, [router]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
    </>
  );
}
