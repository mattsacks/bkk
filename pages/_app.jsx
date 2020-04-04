/* eslint-env node */
import React from "react";
import { SWRConfig } from "swr";
import Layout from "components/Layout";
import { GlobalStateProvider } from "lib/useGlobalState";
import { fetcher } from "lib/request";
import "styles/index.css";

function BKK({ Component, pageProps }) {
  return (
    // <ErrorBoundary>
    <SWRConfig value={{ fetcher }}>
      <GlobalStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStateProvider>
    </SWRConfig>
    // </ErrorBoundary>
  );
}

export default BKK;
