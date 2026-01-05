const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const jsxA11y = require("eslint-plugin-jsx-a11y");

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "jsx-a11y": jsxA11y
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
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
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "*.config.js",
      "next-env.d.ts"
    ]
  }
];
