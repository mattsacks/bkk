"use client";

import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";

import { SECONDS_IN_DAY, Theme, THEME_COOKIE, Themes } from "@/lib/types";

import { isServer } from "./isServer";

/**
 * Chooses a random theme.
 */
export function randomTheme(): Theme {
  return Themes[Math.floor(Math.random() * Themes.length)];
}

/**
 * Retrieves the theme from the document element, initialized in the
 * document script.
 */
function getTheme(): Theme | undefined {
  return !isServer
    ? (document.documentElement.dataset.theme as Theme)
    : undefined;
}

/**
 * Gets and sets the user's preferred theme.
 */
export default function useTheme() {
  const [theme, setTheme] = useState<Theme | undefined>(getTheme);

  const updateTheme = useCallback((theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    setTheme(theme);

    Cookies.set(THEME_COOKIE, theme, {
      expires: SECONDS_IN_DAY * 7
    });
  }, []);

  useEffect(() => {
    if (!theme) {
      setTheme(getTheme());
    }
  }, [theme]);

  return [theme, updateTheme] as const;
}
