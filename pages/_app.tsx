import "@/styles/index.css";

import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";

import { DataContext, useInitializeToken } from "@/components/DataContext";
import { fetcher } from "@/lib/request";
import useColorScheme from "@/lib/useColorScheme";

function BKK({ Component, pageProps }: AppProps) {
  // Attaches event handler for system colorscheme changes
  useColorScheme();

  const [token, setToken] = useInitializeToken();

  return (
    <React.Fragment>
      <Head>
        <meta name="author" content="Matt Sacks" />
        <meta
          name="description"
          content="Sing songz in ur private karaokee roomz"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta property="og:image" content="/assets/bkk-logo.png" />
        <meta
          property="og:description"
          content="Sing songz in ur private karaokee roomz"
        />
        <meta property="og:title" content="Baby Ketten Karaoke" />
        <link rel="shortcut icon" href="/assets/favicon.png" sizes="32x32" />
        <link
          rel="shortcut icon"
          href="/assets/favicon-large.png"
          sizes="180x180"
        />
        <title>Baby Ketten Karaoke</title>
      </Head>
      <DataContext value={{ token, setToken }}>
        <SWRConfig value={{ fetcher }}>
          <main>
            <Component {...pageProps} />
          </main>
        </SWRConfig>
      </DataContext>
    </React.Fragment>
  );
}

export default BKK;
