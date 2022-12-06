module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "jsx-a11y", "simple-import-sort"],
  extends: [
    "next",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-var-requires": 0,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"]
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        destructuredArrayIgnorePattern: "^_"
      }
    ],
    "no-unused-vars": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
};
