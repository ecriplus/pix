import pixRecommendedConfig from '@1024pix/eslint-plugin/config';
import { fixupPluginRules } from '@eslint/compat';
import { defineConfig, globalIgnores } from 'eslint/config';
import chaiExpect from 'eslint-plugin-chai-expect';
import i18nJsonPlugin from 'eslint-plugin-i18n-json';
import _import from 'eslint-plugin-import-x';
import knex from 'eslint-plugin-knex';
import mocha from 'eslint-plugin-mocha';
import nRecommendedConfig from 'eslint-plugin-n';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';

const nonPhraseGeneratedFiles = ['translations/en.json', 'translations/fr.json'];

export default defineConfig([
  // Loads plugins with global rules
  ...pixRecommendedConfig,
  prettierRecommendedConfig,
  nRecommendedConfig.configs['flat/recommended'],
  chaiExpect.configs['recommended-flat'],
  { plugins: { import: _import } },
  { plugins: { knex: fixupPluginRules(knex) } },
  { plugins: { unicorn } },
  // Overridden rules for "js" files
  {
    files: ['**/*.{js,mjs}'],
    rules: {
      'no-console': 'error',
      'no-sync': 'error',
      'knex/avoid-injections': 'error',
      'no-empty-function': 'error',
      'n/no-process-exit': 'error',
      'unicorn/no-empty-file': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'n/no-unpublished-import': 'off',
    },
  },
  // Overridden rules for "scripts" files
  {
    files: ['scripts/**/*.js'],
    rules: { 'no-console': 'off' },
  },
  // Overridden rules for "tests" files
  {
    ...mocha.configs.recommended,
    files: ['tests/**/*.js'],
    rules: {
      ...mocha.configs.recommended.rules,
      'mocha/no-hooks-for-single-case': 'off',
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-pending-tests': 'error',
      'mocha/no-top-level-hooks': 'error',
      'mocha/no-setup-in-describe': 'off',
      'mocha/consistent-spacing-between-blocks': 'off',
    },
  },
  {
    files: ['tests/integration/**/*.js'],
    rules: { 'no-restricted-modules': ['error', { paths: ['@hapi/hapi'] }] },
  },
  {
    files: ['tests/integration/application/**/*.js'],
    rules: {
      'no-restricted-modules': [
        'error',
        {
          paths: [
            { name: '../../../server', message: 'Please use http-server-test instead.' },
            { name: '../../../../server', message: 'Please use http-server-test instead.' },
          ],
        },
      ],
    },
  },
  // Overridden rules for "translations" files
  {
    files: nonPhraseGeneratedFiles,
    plugins: { 'i18n-json': i18nJsonPlugin },
    processor: {
      meta: { name: '.json' },
      ...i18nJsonPlugin.processors['.json'],
    },
    rules: {
      ...i18nJsonPlugin.configs.recommended.rules,
    },
  },
  // Ignored files
  globalIgnores(['tests/integration/tooling/db-schemalint.cjs']),
]);
