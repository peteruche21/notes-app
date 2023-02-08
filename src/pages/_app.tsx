import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import RootProvider from "./providers";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RootProvider>
      <Component {...pageProps} />
    </RootProvider>
  );
};

export default api.withTRPC(MyApp);
