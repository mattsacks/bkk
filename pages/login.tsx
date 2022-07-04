import cntl from "cntl";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilValue } from "recoil";

import LoginForm from "@/components/LoginForm";
import tokenState from "@/store/atoms/tokenState";

const headingStyles = cntl`
  bg-primary
  leading-snug
  p-6
  text-center
  text-secondary
  md:flex
  md:items-center
  md:h-64
  lg:h-auto
  lg:w-1/2
`;

export default function Login() {
  const router = useRouter();
  const token = useRecoilValue(tokenState);

  if (token) {
    router.replace("/");
    return null;
  }

  return (
    <div className="lg:flex lg:flex-1 h-full">
      <div className={headingStyles}>
        <h1 className="text-4xl md:text-5xl font-bold mx-auto">
          baby ketten karaoke
        </h1>
      </div>
      <div className="bg-secondary w-full md:flex md:flex-grow md:items-center md:w-auto">
        <LoginForm />
      </div>
    </div>
  );
}
