import React from "react";
import App from "next/app";
import Layout from "components/Layout";
import { LoggedInContextProvider } from "lib/useLoggedIn";

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
      <LoggedInContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoggedInContextProvider>
    )
  }
}

export default Bond;
