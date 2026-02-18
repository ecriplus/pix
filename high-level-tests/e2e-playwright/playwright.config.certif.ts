import { defineConfig } from '@playwright/test';

import sharedConfig, { App, isCI, reuseExistingApps, setupWebServer } from './playwright.config.shared.ts';

export default defineConfig({
  ...sharedConfig,
  projects: [
    {
      name: 'Setup - utilisateur certifiable et prêt pour le cléa',
      testDir: 'tests/recette-certif',
      testMatch: '**/prepare-user-ready-for-certifications.spec.ts',
    },
    {
      name: 'Recette',
      testDir: 'tests/recette-certif',
      testMatch: '**/*.spec.ts',
      testIgnore: '**/prepare-user-ready-for-certifications.spec.ts',
      dependencies: ['Setup - utilisateur certifiable et prêt pour le cléa'],
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
        setupWebServer(App.PIX_APP, reuseExistingApps),
        setupWebServer(App.PIX_ORGA, reuseExistingApps),
        setupWebServer(App.PIX_CERTIF, reuseExistingApps),
        setupWebServer(App.PIX_ADMIN, reuseExistingApps),
      ],
});
