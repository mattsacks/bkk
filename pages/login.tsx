import cntl from "cntl";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import LoginForm from "@/components/LoginForm";
import useTheme from "@/lib/useTheme";
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
  const [themeColor, setThemeColor] = useState<string | null>(null);
  const router = useRouter();
  const token = useRecoilValue(tokenState);
  const [theme] = useTheme();

  // Updates the 'theme-color' meta property based on the primary color of the
  // theme. This allows for the  inverted colors of the 'baby ketten karaoke'
  // banner at the top of the page to bleed into the browser chrome.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(`--${theme}-primary`);
    setThemeColor(color);
  }, [theme]);

  if (token) {
    router.replace("/");
    return null;
  }

  return (
    <div className="h-full lg:flex lg:flex-1">
      {themeColor && (
        <Head>
          <meta name="theme-color" content={`${themeColor}`} />
        </Head>
      )}
      <div className={headingStyles}>
        <h1 className="mx-auto text-4xl font-bold md:text-5xl">
          baby ketten karaoke
        </h1>
      </div>
      <div className="w-full bg-secondary md:flex md:w-auto md:flex-grow md:items-center">
        <LoginForm />
      </div>
    </div>
  );
}
