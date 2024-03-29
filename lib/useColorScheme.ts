import { useEffect, useState } from "react";
import store from "store2";

import { COLOR_SCHEME_KEY } from "@/lib/types";

export default function useColorScheme() {
  const colorSchemeMediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );
  const isDarkMode = colorSchemeMediaQuery.matches;
  const preferredColorScheme = store(COLOR_SCHEME_KEY);

  const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => {
    if (preferredColorScheme) {
      return preferredColorScheme;
    }

    return isDarkMode ? "dark" : "light";
  });

  useEffect(() => {
    function onColorSchemeChange(e: MediaQueryListEvent) {
      const isDarkMode = e.matches;

      if (!preferredColorScheme) {
        setColorScheme(isDarkMode ? "dark" : "light");
      }

      // When the user changes the color scheme and it matches the stored
      // preferred color scheme, remove the stored preference
      if (preferredColorScheme === (isDarkMode ? "dark" : "light")) {
        store.remove(COLOR_SCHEME_KEY);
      }
    }

    colorSchemeMediaQuery.addEventListener("change", onColorSchemeChange);

    return () => {
      colorSchemeMediaQuery.removeEventListener("change", onColorSchemeChange);
    };
  }, [colorSchemeMediaQuery, preferredColorScheme]);

  // Something in Next.js inadvertently changes colorScheme state value when
  // routing to the login page. If preferredColorScheme is set and the
  // colorScheme state somehow doesn't match, manually update state.
  useEffect(() => {
    if (preferredColorScheme && colorScheme !== preferredColorScheme) {
      setColorScheme(preferredColorScheme);
    }
  }, [preferredColorScheme, colorScheme]);

  if (colorScheme === "light") {
    document.body.dataset.colorScheme = "light";
  } else {
    delete document.body.dataset.colorScheme;
  }

  return [colorScheme, setColorScheme] as const;
}
