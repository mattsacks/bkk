import React from "react";
import App from "next/app";
import Layout from "components/Layout";
import { LoggedInContextProvider } from "lib/useLoggedIn";

import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";

console.error("BUGSNAG API", process.env.BUGSNAG_API_KEY);

const bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY);
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin("react");

class Bond extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ErrorBoundary>
        <LoggedInContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LoggedInContextProvider>
      </ErrorBoundary>
    );
  }
}

export default Bond;
