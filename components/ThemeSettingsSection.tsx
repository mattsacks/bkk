import classNames from "classnames";
import { useEffect, useState } from "react";

import { isServer } from "@/lib/isServer";
import { Themes } from "@/lib/types";
import useColorScheme from "@/lib/useColorScheme";
import useTheme from "@/lib/useTheme";

/**
 * Displays available themes for the user to choose from in the Settings page.
 */
export function ThemeSettingsSection() {
  const [hasRendered, setHasRendered] = useState(false);
  const [userTheme, setUserTheme] = useTheme();
  const [userColorScheme, setUserColorScheme] = useColorScheme();

  useEffect(() => {
    if (!isServer) {
      setHasRendered(true);
    }
  }, [hasRendered]);

  const ThemeSwatches = Themes.map((theme) => {
    const isCurrentTheme = theme === userTheme;

    return (
      <div key={theme}>
        <button
          className={classNames("theme-swatch", {
            underline: isCurrentTheme
          })}
          data-theme={theme}
          /*
           * NOTE: Only necessary until light-dark() or container style queries
           * are baseline supported. CSS variables will be able to inherit from
           * the context.
           */
          data-color-scheme={userColorScheme}
          onClick={() => {
            setUserTheme(theme);
          }}
        >
          {theme}
        </button>
      </div>
    );
  });

  if (!hasRendered) {
    return <section></section>;
  }

  return (
    <section>
      <div className="mb-2 flex justify-between">
        <div>Theme</div>
        <div
          aria-label="Buttons for changing the preferred color-scheme"
          className="flex gap-4"
          role="group"
        >
          <button
            className={userColorScheme === "light" ? "underline" : ""}
            onClick={() => {
              setUserColorScheme("light");
            }}
          >
            Light
          </button>
          <button
            className={userColorScheme === "dark" ? "underline" : ""}
            onClick={() => {
              setUserColorScheme("dark");
            }}
          >
            Dark
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-gutter md:grid-cols-3">
        {ThemeSwatches}
      </div>
    </section>
  );
}
