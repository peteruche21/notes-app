import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "@rainbow-me/rainbowkit/styles.css";

import { api } from "../../utils/api";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  getDefaultWallets,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";
import db from "../../db";
import NavBar from "../../components/Nav";

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "notes-app",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const RootProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<{
    AUTHENTICATION_STATUS: "loading" | "authenticated" | "unauthenticated";
    nonce?: {
      expirationTime?: string;
      issuedAt?: string;
      nonce?: string;
    };
  }>({
    AUTHENTICATION_STATUS: "unauthenticated",
  });

  const router = useRouter();

  const { isConnected, address } = useAccount();

  const authNonce = api.auth.authNonce.useQuery(undefined, {
    enabled: false,
  });

  const authLogout = api.auth.authLogout.useQuery(undefined, {
    enabled: false,
  });

  const authVerify = api.auth.authVerify.useMutation();

  const authVerified = api.auth.authVerified.useQuery(address, {
    enabled: false,
  });

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await authNonce.refetch();
      return response.data?.nonce as string;
    },

    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to notes app",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },

    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },

    verify: async ({ message, signature }) => {
      const { _db: DB } = await db(process.env.NEXT_PUBLIC_CONTRACT_TX_ID);
      const opts = await DB.createTempAddress(message.address);

      const result = await authVerify.mutateAsync({
        message,
        signature,
        opts: opts,
      });

      return Boolean(result.ok);
    },

    signOut: async () => {
      await authLogout.refetch();
      setState((x) => ({ ...x, AUTHENTICATION_STATUS: "unauthenticated" }));
    },
  });

  const isAuthenticated = async () => {
    await authVerified.refetch();

    if (!isConnected || !authVerified.data) return;

    if (authVerified?.data?.ok) {
      setState((x) => ({ ...x, AUTHENTICATION_STATUS: "authenticated" }));
      if (router.pathname == "/login") void router.push("/");
    } else {
      setState((x) => ({
        ...x,
        AUTHENTICATION_STATUS: "unauthenticated",
      }));
    }
  };

  useEffect(() => {
    void isAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, authVerify.data, authVerified.data]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={state.AUTHENTICATION_STATUS}
      >
        <RainbowKitProvider
          modalSize="compact"
          chains={chains}
          initialChain={mainnet}
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          <NavBar />
          <div className="container mx-auto my-10 p-4">{children}</div>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
};

export default RootProvider;
