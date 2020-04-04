import React from "react";
import Nav, { NavItem } from "components/Nav";
import Router from "next/router";
import useTheme from "lib/useTheme";
import withToken from "lib/withToken";
import { THEMES } from "lib/types";
import styles from "./settings.module.css";

type Theme = keyof typeof THEMES;

function Settings({ setToken }: { setToken: (value?: string) => void }) {
  const [currentTheme, changeTheme] = useTheme();

  const ThemeSwatches = Object.keys(THEMES).map((theme) => {
    const name = THEMES[theme];
    const isCurrentTheme = process.browser && theme === currentTheme;

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
            bkk.bar was made by four best friends.{" "}
            <br className="hidden md:block" />
            You can find the source code at{" "}
            <a
              className="underline"
              href="https://github.com/mattsacks/bkk"
              target="_blank"
              rel="noopener noreferrer"
            >
              @mattsacks/bkk
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className={styles.heading}>Session:</h2>
          <button
            className="button"
            onClick={() => {
              setToken(null);
              Router.push("/");
            }}
          >
            Leave room
          </button>
        </section>
      </div>
    </div>
  );
}

export default withToken(Settings);