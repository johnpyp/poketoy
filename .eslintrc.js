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
  plugins: ["react", "@typescript-eslint", "import"],
  rules: {
    "import/no-default-export": ["warn"],
    "@typescript-eslint/no-explicit-any": ["off"],
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
