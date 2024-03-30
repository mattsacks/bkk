import React, { useEffect, useState } from "react";
import store from "store2";

import NoSSR from "@/components/NoSSR";
import { COLOR_SCHEME_KEY, THEME } from "@/lib/types";
import useColorScheme from "@/lib/useColorScheme";
import useTheme from "@/lib/useTheme";

import styles from "./ThemeSettingsSection.module.css";

let cachedRendered = false;

/**
 * Displays available themes for the user to choose from in the Settings page.
 *
 * NOTE: Default export is wrapped with <NoSSR />
 */
function ThemeSettingsSection() {
  const [currentTheme, changeTheme] = useTheme();
  const [hasRendered, setHasRendered] = useState(cachedRendered);
  const [colorScheme, setColorScheme] = useColorScheme();

  // Used to prevent a className mismatch when highlighting the current theme
  // (stored in localStorage).
  useEffect(() => {
    if (!hasRendered) {
      cachedRendered = true;
      setHasRendered(true);
    }
  }, [hasRendered]);

  const ThemeSwatches = Object.entries(THEME).map(([themeKey, themeName]) => {
    const isCurrentTheme = hasRendered && themeKey === currentTheme;

    return (
      <div key={themeKey}>
        <button
          className={`${isCurrentTheme ? "underline" : ""} ${
            styles.themeSwatch
          } ${styles[themeKey]}`}
          onClick={() => {
            changeTheme(themeKey as keyof typeof THEME);
          }}
        >
          {themeName}
        </button>
      </div>
    );
  });

  return (
    <section>
      <div className="mb-1 flex justify-between">
        <div>Theme</div>
        {currentTheme !== "blazers" && (
          <div
            aria-label="Buttons for changing the preferred color-scheme"
            className="flex gap-4"
            role="group"
          >
            <button
              className={colorScheme === "light" ? "underline" : ""}
              onClick={() => {
                store.set(COLOR_SCHEME_KEY, "light");
                setColorScheme("light");
              }}
            >
              Light
            </button>
            <button
              className={colorScheme === "dark" ? "underline" : ""}
              onClick={() => {
                store.set(COLOR_SCHEME_KEY, "dark");
                setColorScheme("dark");
              }}
            >
              Dark
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {ThemeSwatches}
      </div>
    </section>
  );
}

export default function ClientThemeSettingsSection() {
  return (
    <NoSSR>
      <ThemeSettingsSection />
    </NoSSR>
  );
}
