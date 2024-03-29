import React, { useEffect, useState } from "react";

import { THEME } from "@/lib/types";
import useTheme from "@/lib/useTheme";

import styles from "./ThemeSettingsSection.module.css";

let cachedRendered = false;

const colorSchemeMediaQuery =
  typeof window === "undefined"
    ? null
    : window.matchMedia("(prefers-color-scheme: dark)");

/**
 * Displays available themes for the user to choose from in the Settings page.
 */
export default function ThemeSettingsSection() {
  const [currentTheme, changeTheme] = useTheme();
  const [hasRendered, setHasRendered] = useState(cachedRendered);

  const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => {
    if (!colorSchemeMediaQuery) {
      return "dark";
    }

    // TODO: Check localStorage for custom color scheme

    const isDarkMode = colorSchemeMediaQuery.matches;
    return isDarkMode ? "dark" : "light";
  });

  // Used to prevent a className mismatch when highlighting the current theme
  // (stored in localStorage).
  useEffect(() => {
    if (!hasRendered) {
      cachedRendered = true;
      setHasRendered(true);
    }
  }, [hasRendered]);

  useEffect(() => {
    if (!colorSchemeMediaQuery) {
      return;
    }

    function onColorSchemeChange(e: MediaQueryListEvent) {
      const isDarkMode = e.matches;

      // TODO: Remove colorScheme from localStorage if this is the same value
      setColorScheme(isDarkMode ? "dark" : "light");
    }

    colorSchemeMediaQuery.addEventListener("change", onColorSchemeChange);

    return () => {
      colorSchemeMediaQuery.removeEventListener("change", onColorSchemeChange);
    };
  }, []);

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
        <div>Theme:</div>
        {currentTheme !== "blazers" && (
          <div className="flex gap-4">
            <button
              className={colorScheme === "light" ? "underline" : ""}
              onClick={() => {
                setColorScheme("light");
              }}
            >
              Light
            </button>
            <button
              className={colorScheme === "dark" ? "underline" : ""}
              onClick={() => {
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
