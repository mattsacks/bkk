import Head from "next/head";
import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";

export default function Layout(props) {
  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="author" content="#PDXBROLIFE" />
        <meta name="description" content="Baby Ketten Karaoke private room app" />

        <meta property="og:image" content="/bkk-logo.png" />
        <meta property="og:description" content="BKK's app to sing songz" />
        <meta property="og:title" content="Baby Ketten Karaoke" />

        <link rel="shortcut icon" href="/favicon.png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon-large.png" sizes="180x180" />
        <title>Baby Ketten Karaoke</title>
      </Head>
      <div className={styles.backgroundContainer}>
        <div className={styles.background}></div>
        <main className={styles.layout}>
          {props.children}
        </main>
      </div>
    </React.Fragment>
  );
}
