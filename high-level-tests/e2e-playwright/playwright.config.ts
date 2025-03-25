import path from 'node:path';

import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

const playwrightFolder = './node_modules/.playwright';

const isCI = Boolean(process.env.CI);
if (!isCI) dotenv.config({ path: path.resolve(import.meta.dirname, '.env.e2e') });

// See https://playwright.dev/docs/test-configuration
export default defineConfig({
  outputDir: `${playwrightFolder}/output`,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  fullyParallel: false,
  reporter: isCI ? [['junit', { outputFile: `${playwrightFolder}/junit/results.xml` }]] : 'list',

  use: {
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    screenshot: isCI ? 'only-on-failure' : 'off',
  },

  projects: [
    {
      name: 'pix-app-setup',
      testDir: 'pix-app',
      use: { baseURL: process.env.PIX_APP_URL },
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'pix-app',
      testDir: 'pix-app',
      use: { baseURL: process.env.PIX_APP_URL },
      dependencies: ['pix-app-setup'],
    },
    {
      name: 'pix-orga-setup',
      testDir: 'pix-orga',
      use: { baseURL: process.env.PIX_ORGA_URL },
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'pix-orga',
      testDir: 'pix-orga',
      use: { baseURL: process.env.PIX_ORGA_URL },
      dependencies: ['pix-orga-setup'],
    },
  ],

  webServer: isCI
    ? [
        {
          command: 'while true; do echo "Wait for App to start"; sleep 300; done',
          url: process.env.PIX_APP_URL || process.env.PIX_ORGA_URL,
          reuseExistingServer: true,
        },
      ]
    : [
        {
          cwd: '../../api',
          command: 'npm run db:prepare && npm run start',
          url: `http://localhost:${process.env.PIX_API_PORT}`,
          reuseExistingServer: false,
          stdout: 'ignore',
          stderr: 'pipe',
          env: {
            PORT: process.env.PIX_API_PORT || '',
            DATABASE_URL: process.env.DATABASE_URL || '',
            DATAMART_DATABASE_URL: process.env.DATAMART_DATABASE_URL || '',
            DATAWAREHOUSE_DATABASE_URL: process.env.DATAWAREHOUSE_DATABASE_URL || '',
            REDIS_URL: process.env.REDIS_URL || '',
            START_JOB_IN_WEB_PROCESS: 'false',
            PIX_AUDIT_LOGGER_ENABLED: 'false',
            MAILING_ENABLED: 'false',
            FT_PIXAPP_NEW_LAYOUT_ENABLED: 'false',
          },
        },
        {
          cwd: '../../mon-pix',
          command: `npx ember serve --proxy http://localhost:${process.env.PIX_API_PORT}`,
          url: process.env.PIX_APP_URL,
          reuseExistingServer: false,
          stdout: 'ignore',
          stderr: 'pipe',
        },
        {
          cwd: '../../orga',
          command: `npx ember serve --proxy http://localhost:${process.env.PIX_API_PORT}`,
          url: process.env.PIX_ORGA_URL,
          reuseExistingServer: false,
          stdout: 'ignore',
          stderr: 'pipe',
        },
      ],
});
