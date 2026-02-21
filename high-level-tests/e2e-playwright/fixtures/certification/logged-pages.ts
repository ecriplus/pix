import { randomUUID } from 'node:crypto';
import path from 'node:path';

import { Browser, type BrowserContext, Page } from '@playwright/test';

import { AUTH_DIR, Credentials, HAR_DIR, saveStorageState, shouldRecordHAR } from '../../helpers/auth.ts';
import { PixAdminUserData } from '../../helpers/certification/builders/build-pix-admin-user.ts';
import { buildPixCertifUser, PixCertifUserData } from '../../helpers/certification/builders/build-pix-certif-user.ts';
import { buildPixAdminUser } from '../../helpers/certification/builders/index.ts';
import { knex } from '../../helpers/db.ts';
import { CERTIFICATIONS_DATA } from '../../helpers/db-data.ts';
import { test as sharedTest } from '../index.ts';

export const loggedPagesFixtures = sharedTest.extend<
  {
    pixAdminRoleCertifPage: Page;
    pixCertifProPage: Page;
    pixCertifInvigilatorPage: Page;
  },
  {
    workerUniqueId: string;
    nextId: () => number;
    generateUniqueUserId: () => Generator<number, void, unknown>;
    pixAdminRoleCertifWorkerContext: BrowserContext;
    pixCertifProWorkerContext: BrowserContext;
  }
>({
  pixAdminRoleCertifPage: async ({ pixAdminRoleCertifWorkerContext }, use) => {
    const page = await pixAdminRoleCertifWorkerContext.newPage();
    await page.goto(process.env.PIX_ADMIN_URL!);
    await use(page);
    await page.close();
  },
  pixCertifProPage: async ({ pixCertifProWorkerContext }, use) => {
    const page = await pixCertifProWorkerContext.newPage();
    await page.goto(process.env.PIX_CERTIF_URL!);
    await use(page);
    await page.close();
  },
  pixCertifInvigilatorPage: async ({ pixCertifProWorkerContext }, use) => {
    const page = await pixCertifProWorkerContext.newPage();
    await page.goto(process.env.PIX_CERTIF_URL + '/connexion-espace-surveillant');
    await use(page);
    await page.close();
  },
  workerUniqueId: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => {
      const shortUuid = randomUUID().replace(/-/g, '').slice(0, 10);
      const id = `${workerInfo.workerIndex}_${shortUuid}`;
      await use(id);
    },
    { scope: 'worker' },
  ],
  nextId: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => {
      const workerOffset = workerInfo.workerIndex * 10_000;

      function* idGenerator() {
        let counter = 0;
        while (true) {
          yield workerOffset + counter++;
        }
      }

      const generatorInstance = idGenerator();
      const nextId: () => number = () => generatorInstance.next().value!;

      await use(nextId);
    },
    { scope: 'worker' },
  ],
  pixAdminRoleCertifWorkerContext: [
    async ({ workerUniqueId, browser, nextId }, use) => {
      const adminUserData: PixAdminUserData = {
        id: nextId(),
        firstName: 'pixAdminRoleCertif',
        lastName: `pixAdminRoleCertif${workerUniqueId}`,
        email: `pix-admin-role-certif-${workerUniqueId}@example.net`,
        rawPassword: 'pix123',
        role: 'CERTIF',
      };
      await buildPixAdminUser(knex, adminUserData);

      const credentials = {
        id: adminUserData.id,
        label: `pix-admin-role-certif-${workerUniqueId}`,
        firstName: adminUserData.firstName,
        lastName: adminUserData.lastName,
        email: adminUserData.email,
        rawPassword: adminUserData.rawPassword,
        appUrl: process.env.PIX_ADMIN_URL!,
      };
      const context = await setupContext(browser, credentials, workerUniqueId);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixCertifProWorkerContext: [
    async ({ workerUniqueId, browser, nextId }, use) => {
      const certifProUserData: PixCertifUserData = {
        id: nextId(),
        firstName: 'pixCertifPro',
        lastName: `pixCertifPro${workerUniqueId}`,
        email: `pix-certif-pro-${workerUniqueId}@example.net`,
        rawPassword: 'pix123',
        certificationCenters: [
          {
            type: 'PRO',
            externalId: `CERTIFPRO${workerUniqueId}`,
            habilitations: [CERTIFICATIONS_DATA.CLEA.key],
            withOrganization: {
              isManagingStudents: false,
            },
          },
        ],
      };
      await buildPixCertifUser(knex, certifProUserData);

      const credentials = {
        id: certifProUserData.id,
        label: `pix-certif-pro-${workerUniqueId}`,
        firstName: certifProUserData.firstName,
        lastName: certifProUserData.lastName,
        email: certifProUserData.email,
        rawPassword: certifProUserData.rawPassword,
        appUrl: process.env.PIX_CERTIF_URL!,
      };
      const context = await setupContext(browser, credentials, workerUniqueId);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
});

async function setupContext(browser: Browser, credentials: Credentials, workerUniqueId: string) {
  await saveStorageState(credentials);

  const authFilePath = path.join(AUTH_DIR, `${credentials.label}.json`);
  const harFilePath = path.join(HAR_DIR, `${workerUniqueId}-${credentials.label}.har`);
  const recordHar = shouldRecordHAR
    ? {
        path: harFilePath,
        content: 'omit' as const,
      }
    : undefined;
  return browser.newContext({ storageState: authFilePath, recordHar });
}
