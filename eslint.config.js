const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const nextConfig = require("eslint-config-next");

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextConfig,
  prettier,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort
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
      "simple-import-sort/exports": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    },
    settings: {
      react: {
        version: "detect"
      },
      next: {
        rootDir: __dirname
      }
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
