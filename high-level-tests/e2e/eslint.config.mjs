import pluginCypress from "eslint-plugin-cypress";

export default [
  {
    ignores: ["**/*.cjs"],
    ...pluginCypress.configs.recommended,
  },
  {
    ignores: ["**/*.cjs"],
    ...pluginCypress.configs.globals,
  },
  {
    rules: {
      "no-unused-vars": [2, { argsIgnorePattern: "_" }],
    },
  },
];
