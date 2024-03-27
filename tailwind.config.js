const defaultTheme = require("tailwindcss/defaultTheme");

/* eslint-env node */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",

        default: {
          primary: "var(--default-primary)",
          secondary: "var(--default-secondary)"
        },
        blue: {
          primary: "var(--blue-primary)",
          secondary: "var(--blue-secondary)"
        },
        terminal: {
          primary: "var(--terminal-primary)",
          secondary: "var(--terminal-secondary)"
        },
        miami: {
          primary: "var(--miami-primary)",
          secondary: "var(--miami-secondary)"
        },
        "earl-grey": {
          primary: "var(--earl-grey-primary)",
          secondary: "var(--earl-grey-secondary)"
        }
      },
      screens: {
        xs: "360px"
      },
      borderColor: {
        transparent: "transparent"
      },
      inset: {
        0: 0,
        full: "100%"
      },
      flex: {
        2: "2 2 0%"
      },
      spacing: {
        "-2px": "-2px",
        "2px": "2px",
        "01": "0.1rem"
      },
      fontFamily: {
        mono: ["VT323", ...defaultTheme.fontFamily.mono]
      }
    }
  },
  variants: {
    opacity: ["responsive", "hover", "focus", "disabled", "active"],
    pointerEvents: ["responsive", "hover", "focus", "disabled"],
    borderWidth: ["responsive", "hover", "focus", "last"],
    margin: ["responsive", "hover", "focus", "last"]
  }
};
