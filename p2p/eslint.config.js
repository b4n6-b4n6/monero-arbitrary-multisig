import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-trailing-spaces": ["error"],
      "eol-last": ["error", "always"],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }]
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      }
    }
  },
];
// TODO: how do i get eslint to lint js files in binaries folder