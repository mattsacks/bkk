import React from "react";
import qs from "qs";
import { TokenState, USER_COOKIE } from "lib/types";
import withToken from "lib/withToken";
import LoginForm from "components/LoginForm";
import App from "components/App";
import styles from "./index.module.css";

interface IndexProps {
  token: TokenState;
  setToken: (TokenState) => void;
}

function Index({ token, setToken }: IndexProps) {
  if (!token) {
    return (
      <>
        <div className={styles.heading}>
          <h1 className="text-4xl md:text-5xl font-bold mx-auto md:w-56 md:w-full max-w-sm">
            baby ketten karaoke
          </h1>
        </div>
        <div className="md:flex-1 bg-secondary w-full">
          <LoginForm setToken={setToken} />
        </div>
      </>
    );
  }

  return <App setToken={setToken} />;
}

export async function getServerSideProps({ req }) {
  const props: { token?: string } = {};

  // Create an object with a key,val for each cookie in the request
  const cookies = Object.assign(
    {},
    ...req.headers.cookie.split("; ").map(qs.parse)
  );

  const token = cookies[USER_COOKIE];
  if (token) {
    props.token = token;
  }

  return { props };
}

export default withToken(Index);
