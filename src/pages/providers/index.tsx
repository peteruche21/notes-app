import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "@rainbow-me/rainbowkit/styles.css";

import { api } from "../../utils/api";

import type { AuthenticationStatus } from "@rainbow-me/rainbowkit";
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
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("loading");

  const router = useRouter();

  const { isConnected, address } = useAccount();

  const authNonce = api.auth.authNonce.useQuery(undefined, {
    enabled: false,
  });

  const authLogout = api.auth.authLogout.useQuery(undefined, {
    enabled: false,
  });

  const authVerify = api.auth.authVerify.useMutation();

  const authVerified = api.auth.authVerified.useQuery(address);

  const redirect = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (router.pathname == "/login") router.push("/");
  };

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
      const result = await authVerify.mutateAsync({
        message,
        signature,
      });

      const authenticated = Boolean(result.ok);

      if (authenticated) {
        setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
        redirect();
      }

      return authenticated;
    },

    signOut: async () => {
      await authLogout.refetch();
      setAuthStatus("unauthenticated");
    },
  });

  const isAuthenticated = () => {
    switch (authVerified.data && authVerified?.data?.ok && isConnected) {
      case true:
        if (authStatus !== "authenticated") setAuthStatus("authenticated");
        redirect();
        break;
      default:
        if (authStatus !== "unauthenticated") setAuthStatus("unauthenticated");
    }
  };

  useEffect(() => {
    isAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, authVerify.data, authVerified.data]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authStatus}
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
