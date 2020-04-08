import React, { useEffect } from "react";
import { useRouter } from "next/router";
import withToken from "lib/withToken";
import { TokenState } from "lib/types";
import LoginForm from "components/LoginForm";
import styles from "./login.module.css";

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
    <div className="lg:flex lg:flex-1 lg:items-stretch">
      <div className={styles.heading}>
        <h1 className="text-4xl md:text-5xl font-bold mx-auto">
          baby ketten karaoke
        </h1>
      </div>
      <div className="bg-secondary w-full md:flex md:flex-grow md:items-center md:w-auto">
        <LoginForm setToken={setToken} />
      </div>
    </div>
  );
}

export default withToken(Login);
