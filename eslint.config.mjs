import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    ignores: [
      "dist/",
      "tailwind.config.js",
      "postcss.config.js",
      "webpack.config.cjs",
    ],
    rules: {
      "no-unused-vars": ["warn"],
    },
  },
];
