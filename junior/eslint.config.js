import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import emberRecommendedConfig from 'eslint-plugin-ember/configs/recommended';
import emberGjsRecommendedConfig from 'eslint-plugin-ember/configs/recommended-gjs';
import qunitRecommendedConfig from 'eslint-plugin-qunit/configs/recommended';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';
import nRecommendedConfig from 'eslint-plugin-n';
import * as pixRecommendedConfig from '@1024pix/eslint-plugin/config';
import emberParser from 'ember-eslint-parser';
import i18nJsonPlugin from 'eslint-plugin-i18n-json';

const unconventionalJsFiles = ['blueprints/**/files/*', 'app/vendor/*'];
const compiledOutputFiles = ['dist/*', 'tmp/*'];
const dependenciesFiles = ['node_modules/*'];
const miscFiles = ['coverage/*', '!**/.*', '**/.eslintcache'];
const emberTryFiles = ['.node_modules.ember-try/*', 'bower.json.ember-try', 'package.json.ember-try'];
const nonPhraseGeneratedFiles = ['translations/en.json', 'translations/fr.json'];

const nodeFiles = [
  'eslint.config.js',
  'ember-cli-build.js',
  'testem.js',
  'blueprints/*/index.js',
  'config/**/*.js',
  'lib/*/index.js',
  'server/**/*.js',
];

const emberPatchedParser = Object.assign(
  {
    meta: {
      name: 'ember-eslint-parser',
      version: '*',
    },
  },
  emberParser,
);

export default [
...pixRecommendedConfig,
...emberRecommendedConfig,
...emberGjsRecommendedConfig,
  qunitRecommendedConfig,
  prettierRecommendedConfig,
  {
    ignores: [...unconventionalJsFiles, ...compiledOutputFiles, ...dependenciesFiles, ...miscFiles, ...emberTryFiles],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        parserOptions: {
          requireConfigFile: false,
          babelOptions: {
            plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
          },
        },
      },
    },
    rules: {
      'no-restricted-imports': ['error', { paths: ['lodash'] }],
      'no-irregular-whitespace': 'off',
    },
  },
  {
    files: ['**/*.gjs'],
    languageOptions: {
      parser: emberPatchedParser,
      sourceType: 'module',
    },
  },
  {
    ...nRecommendedConfig.configs['flat/recommended'],
    files: nodeFiles,

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'script',
    },
  },
  {
    files: ['tests/**/*.js', 'tests/**/*.gjs'],

    languageOptions: {
      globals: {
        ...globals.embertest,
        server: false,
      },
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
  }
]
