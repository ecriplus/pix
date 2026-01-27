import { defineConfig } from '@playwright/test';

import sharedConfig, { App, isCI, setupWebServer } from './playwright.config.shared.ts';

export default defineConfig({
  ...sharedConfig,
  projects: [
    {
      name: 'recette certif - création utilisateur certifiable',
      testDir: 'tests/recette-certif',
      testMatch: '**/create-certifiable-user.ts',
    },
    {
      name: 'recette certif - passage de certif PRO coeur',
      testDir: 'tests/recette-certif',
      testMatch: '**/pro/**/*.ts',
      dependencies: ['recette certif - création utilisateur certifiable'],
    },
  ],

  webServer: isCI
    ? [
        setupWebServer(App.PIX_APP, true),
        setupWebServer(App.PIX_ORGA, true),
        setupWebServer(App.PIX_CERTIF, true),
        setupWebServer(App.PIX_ADMIN, true),
      ]
    : [
        setupWebServer(App.PIX_API, false),
        setupWebServer(App.PIX_APP, false),
        setupWebServer(App.PIX_ORGA, false),
        setupWebServer(App.PIX_CERTIF, false),
        setupWebServer(App.PIX_ADMIN, false),
      ],
});
