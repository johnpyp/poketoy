// @ts-check
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    ecmaVersion: 2021,
  },
  plugins: ["react", "@typescript-eslint", "import", "simple-import-sort", "unused-imports"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "import/no-default-export": ["warn"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "unused-imports/no-unused-imports": "error",
    /* "unused-imports/no-unused-vars": [
      "off",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
    ], */
  },
  overrides: [
    {
      files: ["packages/client/**"],
      env: {
        browser: true,
      },
    },
  ],
});
