import { useEffect, useState } from "react";
import { random } from "lodash";
import store from "store2";
import { THEMES } from "lib/types";

export default function useTheme() {
  const [theme, setTheme] = useState(store("theme"));

  function changeTheme(theme: string) {
    store("theme", theme);
    document.body.dataset.theme = theme;
    setTheme(theme);
  }

  useEffect(() => {
    if (!theme) {
      const themeNames = Object.keys(THEMES);
      const randomTheme = themeNames[random(0, themeNames.length - 1)];
      changeTheme(randomTheme);
    } else if (document.body.dataset.theme !== theme) {
      document.body.dataset.theme = theme;
    }
  }, []);

  return [theme, changeTheme] as const;
}
