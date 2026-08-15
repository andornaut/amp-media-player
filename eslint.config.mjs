import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { plugins, sourceRules, toolingRules } from "./eslint.config.base.mjs";

// React is local to this repository and filter-bubble: the plugins and the
// rules turned off below are about JSX, not about house style.
const reactPlugins = {
  ...plugins,
  import: importPlugin,
  react,
  "react-hooks": reactHooks,
};

const reactRules = {
  ...react.configs.recommended.rules,
  ...react.configs["jsx-runtime"].rules,
  ...reactHooks.configs.recommended.rules,
  ...sourceRules,
  "react-hooks/refs": "off", // False positives with wrapper functions
  "react/display-name": "off",
  "react/jsx-no-target-blank": "off",
  "react/no-unescaped-entities": "off",
  "react/prop-types": "off",
};

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  // Source files (React)
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: "module",
    },
    plugins: reactPlugins,
    rules: reactRules,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Build scripts
  {
    files: ["*.mjs", "*.js"],
    ignores: ["src/**", "static/**"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },
    plugins,
    rules: toolingRules,
  },
  // Static JS (vanilla, no React)
  {
    files: ["static/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
      },
      sourceType: "script",
    },
    plugins,
    rules: toolingRules,
  },
];
