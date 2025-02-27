import eslintConfig from '@1024pix/eslint-plugin/config';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  ...eslintConfig,
  ...tseslint.configs.recommended,
  prettier,
];
