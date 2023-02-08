import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";

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
    error?: Error | string;
  }>({
    AUTHENTICATION_STATUS: "unauthenticated",
  });

  const { isConnected } = useAccount();

  const authNonce = api.auth.authNonce.useQuery(undefined, {
    enabled: false,
  });

  const authLogout = api.auth.authLogout.useQuery(undefined, {
    enabled: false,
  });

  const authVerify = api.auth.authVerify.useMutation();

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
      const result = await authVerify.mutateAsync({ message, signature });
      return Boolean(result.ok);
    },

    signOut: async () => {
      await authLogout.refetch();
      setState((x) => ({ ...x, AUTHENTICATION_STATUS: "unauthenticated" }));
    },
  });

  useEffect(() => {
    if (!isConnected || !authVerify.data) return;
    //setState((x) => ({ ...x, AUTHENTICATION_STATUS: "loading" }));
    if (authVerify?.data?.ok) {
      setState((x) => ({ ...x, AUTHENTICATION_STATUS: "authenticated" }));
    } else {
      setState((x) => ({
        ...x,
        AUTHENTICATION_STATUS: "unauthenticated",
        error: authVerify.data?.error,
      }));
    }
  }, [isConnected, authVerify?.data]);

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
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
};

export default RootProvider;
