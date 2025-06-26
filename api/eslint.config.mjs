import pixRecommendedConfig from '@1024pix/eslint-plugin/config';
import babelParser from '@babel/eslint-parser';
import { fixupPluginRules } from '@eslint/compat';
import chai from 'eslint-plugin-chai-expect';
import i18nJsonPlugin from 'eslint-plugin-i18n-json';
import _import from 'eslint-plugin-import-x';
import knex from 'eslint-plugin-knex';
import mocha from 'eslint-plugin-mocha';
import nRecommendedConfig from 'eslint-plugin-n';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';

const nonPhraseGeneratedFiles = ['translations/en.json', 'translations/fr.json'];

export default [
  ...pixRecommendedConfig,
  prettierRecommendedConfig,
  nRecommendedConfig.configs['flat/recommended'],
  { plugins: { 'chai-expect': fixupPluginRules(chai) } },
  { plugins: { import: _import } },
  { plugins: { knex: fixupPluginRules(knex) } },
  { plugins: { unicorn } },
  {
    files: ['eslint.config.mjs'],
    languageOptions: {},
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: { module: 'readonly', require: 'readonly' },
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          configFile: false,
          babelrc: false,
          parserOpts: {
            plugins: ['importAttributes'],
          },
        },
      },
    },
    rules: {
      'no-console': 'error',
      'no-sync': 'error',
      'knex/avoid-injections': 'error',
      'no-empty-function': 'error',
      'n/no-process-exit': 'error',
      'unicorn/no-empty-file': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'n/no-unpublished-import': 'off',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: ['api/lib/domain/usecases', 'lib/domain/usecases'],
              from: ['api/lib/infrastructure/repositories', 'lib/infrastructure/repositories'],
              except: [],
              message:
                "Repositories are automatically injected in use-case, you don't need to import them. Check for further details: https://github.com/1024pix/pix/blob/dev/docs/adr/0046-injecter-les-dependances-api.md",
            },
            { target: 'tests/unit', from: 'db' },
          ],
        },
      ],
    },
  },
  {
    ...mocha.configs.recommended,
    files: ['tests/**/*.js'],
    rules: {
      ...mocha.configs.recommended.rules,
      'mocha/no-hooks-for-single-case': 'off',
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-pending-tests': 'error',
      'mocha/no-skipped-tests': 'error',
      'mocha/no-top-level-hooks': 'error',
      'mocha/no-setup-in-describe': ['error'],
    },
  },
  {
    files: ['tests/integration/**/*.js'],
    rules: {
      'no-restricted-modules': [
        'error',
        {
          paths: ['@hapi/hapi'],
        },
      ],
    },
  },
  {
    files: ['tests/integration/application/**/*.js'],
    rules: {
      'no-restricted-modules': [
        'error',
        {
          paths: [
            {
              name: '../../../server',
              message: 'Please use http-server-test instead.',
            },
            {
              name: '../../../../server',
              message: 'Please use http-server-test instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['tests/unit/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['knex', 'pg'],
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['lib/**/*.js'],
    rules: {
      'no-restricted-modules': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: 'Please use http-agent instead (ADR 23)',
            },
          ],
        },
      ],
      'n/no-process-env': 'error',
    },
  },
  {
    files: ['lib/application/**/*.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='parseInt']",
          message:
            'parseInt is unnecessary here because Joi already casts string into number if the field is properly described (Joi.number())',
        },
      ],
    },
  },
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
];
