import React from "react";
import { WithTokenProps } from "lib/withToken";
import App from "components/App";

type IndexProps = WithTokenProps;

function Index({ token, setToken }: IndexProps) {
  // FIXME
  return <App token={token} setToken={setToken} />;
}

export default Index;
