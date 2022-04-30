/* eslint-env node */
import React from "react";
import { SWRConfig } from "swr";
import Layout from "components/Layout";
import { GlobalStateProvider } from "lib/useGlobalState";
import { fetcher } from "lib/request";

import "styles/tailwind.css";
import "styles/colors.css";
import "styles/global.css";

// FIXME this seems bad
import "styles/components/app-container.css";
import "styles/components/button.css";
import "styles/components/flag.css";
import "styles/components/input.css";
import "styles/components/invert.css";
import "styles/components/list-item.css";
import "styles/components/submit.css";

function BKK({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <GlobalStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStateProvider>
    </SWRConfig>
  );
}

export default BKK;
