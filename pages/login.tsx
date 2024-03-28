import cntl from "cntl";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import LoginForm from "@/components/LoginForm";
import tokenState from "@/store/atoms/tokenState";

const headingStyles = cntl`
  bg-primary
  leading-snug
  p-6
  text-center
  text-secondary
  sm:h-[25vh]
  flex
  flex-col
  justify-center
  items-center
  lg:h-auto
  lg:w-1/2
`;

export default function Login() {
  const router = useRouter();
  const token = useRecoilValue(tokenState);

  // Adds data-page="login" to the document body for styling
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.body.dataset.page = "login";

    return () => {
      delete document.body.dataset.page;
    };
  }, []);

  if (token) {
    router.replace("/");
    return null;
  }

  return (
    <div className="flex h-full flex-col lg:flex-1 lg:flex-row">
      <div className={headingStyles}>
        <h1 className="mx-auto text-4xl font-bold md:text-5xl">
          baby ketten karaoke
        </h1>
      </div>
      <div className="w-full flex-1 bg-secondary md:flex md:w-auto md:flex-grow lg:flex-auto">
        <LoginForm />
      </div>
    </div>
  );
}
