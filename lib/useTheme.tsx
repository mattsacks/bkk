import random from "lodash/random";
import { useEffect, useState } from "react";
import store from "store2";

import { THEME } from "@/lib/types";
type THEME_NAME = keyof typeof THEME;

/**
 * Chooses a random theme.
 */
function randomTheme(): THEME_NAME {
  const themeNames = Object.keys(THEME) as THEME_NAME[];
  return themeNames[random(0, themeNames.length - 1)];
}

export default function useTheme() {
  const [theme, setTheme] = useState<THEME_NAME>(store("theme"));

  function changeTheme(theme: THEME_NAME) {
    store("theme", theme);
    document.body.dataset.theme = theme;
    setTheme(theme);
  }

  // Chooses a random theme for new users or set the theme style on
  // document.body when changed
  useEffect(() => {
    if (!theme || !THEME[theme]) {
      const initialTheme = randomTheme();
      changeTheme(initialTheme);
    } else if (document.body.dataset.theme !== theme) {
      document.body.dataset.theme = theme;
    }
  }, [theme]);

  return [theme, changeTheme] as const;
}
