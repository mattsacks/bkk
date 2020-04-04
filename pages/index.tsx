import React from "react";
import { TokenState } from "lib/types";
import withToken from "lib/withToken";
import LoginForm from "components/LoginForm";
import App from "components/App";
import styles from "./index.module.css";

interface IndexProps {
  token: TokenState;
  setToken: (TokenState) => void;
}

function Index({ token, setToken }: IndexProps) {
  // Don't render anything for the initial page
  if (!process.browser) {
    return null;
  }

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

export default withToken(Index);
