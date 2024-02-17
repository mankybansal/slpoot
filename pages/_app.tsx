import type { AppProps } from "next/app";
import { ChakraProvider, theme } from "@chakra-ui/react";
import React, { createContext, useEffect } from "react";
import { User } from "@prisma/client";
import axios from "axios";

const MeContext = createContext<{ me: User | null }>({
  me: null,
});

const MeProvider = ({ children }: { children: React.ReactNode }) => {
  const [me, setMe] = React.useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/get-me");
      setMe(result.data);
    };
    void fetchData();
  }, []);

  if (!me) {
    return null;
  }

  return <MeContext.Provider value={{ me }}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  const context = React.useContext(MeContext);
  if (context === undefined) {
    throw new Error("useMe must be used within a MeProvider");
  }
  if (context.me === null) {
    throw new Error("useMe must be used within a MeProvider");
  }
  return { me: context.me };
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <MeProvider>
        <Component {...pageProps} />
      </MeProvider>
    </ChakraProvider>
  );
}
