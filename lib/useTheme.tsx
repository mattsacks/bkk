import { random } from "lodash";
import { useEffect, useState } from "react";
import store from "store2";

import { THEME } from "@/lib/types";
type THEME_NAME = keyof typeof THEME;

export default function useTheme() {
  const [theme, setTheme] = useState<THEME_NAME>(store("theme"));

  function changeTheme(theme: THEME_NAME) {
    store("theme", theme);
    document.body.dataset.theme = theme;
    setTheme(theme);
  }

  // Choose a random theme
  useEffect(() => {
    if (!theme || !THEME[theme]) {
      const themeNames = Object.keys(THEME) as THEME_NAME[];
      const randomTheme = themeNames[random(0, themeNames.length - 1)];
      changeTheme(randomTheme);
    } else if (document.body.dataset.theme !== theme) {
      document.body.dataset.theme = theme;
    }
  }, [theme]);

  return [theme, changeTheme] as const;
}
