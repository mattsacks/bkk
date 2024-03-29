/* eslint-env node */
import "@/styles/index.css";

import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

import NoSSR from "@/components/NoSSR";
import { fetcher } from "@/lib/request";
import useColorScheme from "@/lib/useColorScheme";
import useTheme from "@/lib/useTheme";

// Add color-scheme handling to all pages on the client
function AppColorScheme() {
  useColorScheme();
  return null;
}

function BKK({ Component, pageProps }: AppProps) {
  // Add body[data-theme] to every page
  useTheme();

  return (
    <React.Fragment>
      <Head>
        <meta name="author" content="#PDXBROLIFE" />
        <meta
          name="description"
          content="Baby Ketten Karaoke private room app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <meta property="og:image" content="/assets/bkk-logo.png" />
        <meta property="og:description" content="BKK's app to sing songz" />
        <meta property="og:title" content="Baby Ketten Karaoke" />

        <link rel="shortcut icon" href="/assets/favicon.png" sizes="32x32" />
        <link
          rel="shortcut icon"
          href="/assets/favicon-large.png"
          sizes="180x180"
        />
        <title>Baby Ketten Karaoke</title>
      </Head>
      <RecoilRoot>
        <SWRConfig value={{ fetcher }}>
          <NoSSR>
            <AppColorScheme />
          </NoSSR>
          <Component {...pageProps} />
        </SWRConfig>
      </RecoilRoot>
    </React.Fragment>
  );
}

export default BKK;
