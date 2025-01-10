import pluginCypress from "eslint-plugin-cypress/flat";

export default [
  {
    ignores: ["**/cypress/plugins/*.js"],
    plugins: { pluginCypress },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": [2, { argsIgnorePattern: "_" }],
    },
  },
];
