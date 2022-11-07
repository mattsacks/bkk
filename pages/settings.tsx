import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import Nav, { NavItem } from "@/components/Nav";
import { THEMES } from "@/lib/types";
import useTheme from "@/lib/useTheme";
import tokenState from "@/store/atoms/tokenState";

import styles from "./settings.module.css";

type Theme = keyof typeof THEMES;

let cachedRendered = false;

export default function Settings() {
  const router = useRouter();
  const setToken = useSetRecoilState(tokenState);
  const [currentTheme, changeTheme] = useTheme();
  const [hasRendered, setHasRendered] = useState(cachedRendered);

  // Used to prevent a className mismatch when highlighting the current them
  // (stored in localStorage). Cached in module space so this is only done on
  // hydration.
  useEffect(() => {
    if (!hasRendered) {
      cachedRendered = true;
      setHasRendered(true);
    }
  }, [hasRendered]);

  const ThemeSwatches = Object.keys(THEMES).map((theme) => {
    const name = THEMES[theme as Theme];
    const isCurrentTheme = hasRendered && theme === currentTheme;

    return (
      <div key={theme}>
        <button
          className={`${isCurrentTheme ? "underline" : ""} ${
            styles.themeSwatch
          } ${styles[theme]}`}
          onClick={() => changeTheme(theme)}
        >
          {name}
        </button>
      </div>
    );
  });

  return (
    <div className="app-container">
      <Nav>
        <div></div>
        <NavItem href="/" text="search songs &gt;" />
      </Nav>
      <div>
        <section className="mb-6">
          <h2 className={styles.heading}>Theme:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ThemeSwatches}
          </div>
        </section>

        <section className="mb-6">
          <h2 className={styles.heading}>About:</h2>
          <p className="leading-tight">
            Source code for bkk.bar is available on{" "}
            <a
              className="underline"
              href="https://github.com/mattsacks/bkk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className={styles.heading}>Session:</h2>
          <button
            className="outline-button"
            onClick={() => {
              setToken(undefined);
              router.push("/login");
            }}
          >
            Leave room
          </button>
        </section>
      </div>
    </div>
  );
}
