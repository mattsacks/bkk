import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import Nav, { NavItem } from "@/components/Nav";
import { THEME } from "@/lib/types";
import useTheme from "@/lib/useTheme";
import searchState from "@/store/atoms/searchState";
import tokenState from "@/store/atoms/tokenState";

import styles from "./settings.module.css";

let cachedRendered = false;

interface SettingsSectionProps extends React.PropsWithChildren {
  heading: string;
}

function SettingsSection(props: SettingsSectionProps) {
  const { children, heading } = props;

  return (
    <section>
      <div className="mb-1">{heading}:</div>
      {children}
    </section>
  );
}

export default function Settings() {
  const router = useRouter();
  const setSearchQuery = useSetRecoilState(searchState);
  const setToken = useSetRecoilState(tokenState);
  const [currentTheme, changeTheme] = useTheme();
  const [hasRendered, setHasRendered] = useState(cachedRendered);

  // Used to prevent a className mismatch when highlighting the current theme
  // (stored in localStorage).
  useEffect(() => {
    if (!hasRendered) {
      cachedRendered = true;
      setHasRendered(true);
    }
  }, [hasRendered]);

  const ThemeSwatches = Object.entries(THEME).map(([theme, themeName]) => {
    const isCurrentTheme = hasRendered && themeName === currentTheme;

    return (
      <div key={theme}>
        <button
          className={`${isCurrentTheme ? "underline" : ""} ${
            styles.themeSwatch
          } ${styles[theme]}`}
          onClick={() => {
            changeTheme(theme as keyof typeof THEME);
          }}
        >
          {themeName}
        </button>
      </div>
    );
  });

  return (
    <div className="app-container">
      <Nav>
        <NavItem href="/queue" text="&lt; view queue" />
        <NavItem href="/" text="search songs &gt;" />
      </Nav>
      <div className="flex flex-col gap-6">
        <SettingsSection heading="Theme">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {ThemeSwatches}
          </div>
        </SettingsSection>
        <SettingsSection heading="About">
          <p className="leading-tight">
            Source code for bkk.bar is available on{" "}
            <a
              className="underline"
              href="https://github.com/mattsacks/bkk"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </SettingsSection>
        <SettingsSection heading="Session">
          <button
            className="outline-button"
            onClick={() => {
              setSearchQuery("");
              setToken(undefined);

              router.push("/login");
            }}
          >
            Leave room
          </button>
        </SettingsSection>
      </div>
    </div>
  );
}
