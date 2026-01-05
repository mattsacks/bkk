"use client";

import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";

import { MAX_COOKIE_DAYS, Theme, THEME_COOKIE, Themes } from "@/lib/types";

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
      expires: MAX_COOKIE_DAYS
    });
  }, []);

  useEffect(() => {
    if (!theme) {
      // Hydration: Sync theme from cookie after SSR
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(getTheme());
    }
  }, [theme]);

  return [theme, updateTheme] as const;
}
