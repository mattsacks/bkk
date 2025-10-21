import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";

import { COLOR_SCHEME_COOKIE, ColorScheme, MAX_COOKIE_DAYS } from "@/lib/types";

import { isServer } from "./isServer";

function getColorScheme(): ColorScheme | undefined {
  return !isServer
    ? (document.documentElement.dataset.colorScheme as ColorScheme)
    : undefined;
}

/**
 * Gets and sets the user's preferred color-scheme.
 */
export default function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<ColorScheme | undefined>(
    getColorScheme
  );

  const updateColorScheme = useCallback(
    (newColorScheme: ColorScheme) => {
      setColorScheme(newColorScheme);
      document.documentElement.dataset.colorScheme = newColorScheme;

      // Store if the color scheme doesn't match the current value matched by the
      // system.
      if (newColorScheme !== colorScheme) {
        Cookies.set(COLOR_SCHEME_COOKIE, newColorScheme, {
          expires: MAX_COOKIE_DAYS
        });
      }
    },
    [colorScheme]
  );

  useEffect(() => {
    if (!colorScheme) {
      setColorScheme(getColorScheme());
    }
  }, [colorScheme]);

  /**
   * Add event handler for changes to the system colorscheme when the user
   * doesn't have a preference set.
   */
  useEffect(() => {
    function matchColorSchemeChange(event: MediaQueryListEvent) {
      const preferredColorScheme = Cookies.get(COLOR_SCHEME_COOKIE);

      if (!preferredColorScheme) {
        const newColorScheme = event.matches ? "dark" : "light";
        setColorScheme(newColorScheme);
        document.documentElement.dataset.colorScheme = newColorScheme;
      }
    }

    let matchesDarkColorScheme: MediaQueryList | undefined;

    if (!isServer) {
      matchesDarkColorScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      matchesDarkColorScheme.addEventListener("change", matchColorSchemeChange);
    }

    return () => {
      matchesDarkColorScheme?.removeEventListener(
        "change",
        matchColorSchemeChange
      );
    };
  }, []);

  return [colorScheme, updateColorScheme] as const;
}
