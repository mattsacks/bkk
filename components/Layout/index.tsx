import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useTheme from "lib/useTheme";
import withToken, { WithTokenProps } from "lib/withToken";

interface Props extends WithTokenProps {
  children: any;
}

function Layout({ children, token, setToken }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token]);

  // Add body[data-theme] to every page
  useTheme();

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="author" content="#PDXBROLIFE" />
        <meta
          name="description"
          content="Baby Ketten Karaoke private room app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <meta property="og:image" content="/bkk-logo.png" />
        <meta property="og:description" content="BKK's app to sing songz" />
        <meta property="og:title" content="Baby Ketten Karaoke" />

        <link rel="shortcut icon" href="/favicon.png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon-large.png" sizes="180x180" />

        <title>Baby Ketten Karaoke</title>
      </Head>
      <main>{React.cloneElement(children, { token, setToken })}</main>
    </React.Fragment>
  );
}

export default withToken(Layout);
