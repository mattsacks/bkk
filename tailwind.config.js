/* eslint-env node */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    screens: {
      ...defaultTheme.screens,
      xs: "360px"
    },
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
    borderColor: (theme) => ({
      ...theme("colors"),
      transparent: "transparent"
    }),
    inset: {
      "0": 0,
      full: "100%"
    },
    flex: {
      ...defaultTheme.flex,
      "2": "2 2 0%"
    },
    spacing: {
      ...defaultTheme.spacing,
      "-2px": "-2px",
      "2px": "2px",
      "01": "0.1rem"
    }
  },
  variants: {
    opacity: ["responsive", "hover", "focus", "disabled", "active"],
    pointerEvents: ["responsive", "hover", "focus", "disabled"],
    borderWidth: ["responsive", "hover", "focus", "last"],
    margin: ["responsive", "hover", "focus", "last"]
  }
};
