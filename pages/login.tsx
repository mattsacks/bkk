import React, { useEffect } from "react";
import { useRouter } from "next/router";
import withToken from "lib/withToken";
import { TokenState } from "lib/types";
import LoginForm from "components/LoginForm";
import cntl from "cntl";

const headingStyles = cntl`
  bg-primary
  leading-snug
  p-6
  text-center
  text-secondary
  sm:min-w-max
  md:flex
  md:items-center
  md:h-64
  lg:h-auto
  lg:w-1/3
`;

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
      <div className={headingStyles}>
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
