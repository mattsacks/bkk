import React, { useEffect } from "react";
import { useRouter } from "next/router";
import withToken from "lib/withToken";
import { TokenState } from "lib/types";
import LoginForm from "components/LoginForm";
import styles from "./index.module.css";

interface Props {
  token: TokenState;
  setToken: (TokenState) => void;
}

function Login({ token, setToken }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token]);

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

export default withToken(Login);
