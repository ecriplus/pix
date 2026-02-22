import { randomUUID } from 'node:crypto';
import path from 'node:path';

import { Browser, type BrowserContext, Page } from '@playwright/test';

import { AUTH_DIR, Credentials, HAR_DIR, saveStorageState, shouldRecordHAR } from '../../helpers/auth.ts';
import { buildPixAdminUser, buildPixCertifUser } from '../../helpers/certification/builders/index.ts';
import {
  PixAdminUserData,
  PixCertifiableUserData,
  PixCertifUserData,
} from '../../helpers/certification/builders/types.ts';
import { knex } from '../../helpers/db.ts';
import { CERTIFICATIONS_DATA } from '../../helpers/db-data.ts';
import { createUserInDB } from '../../helpers/db-utils.ts';
import {
  ChallengePage,
  FinalCheckpointPage,
  IntermediateCheckpointPage,
  StartCampaignPage,
} from '../../pages/pix-app/index.ts';
import { PixOrgaPage } from '../../pages/pix-orga/index.ts';
import { expect, test as sharedTest } from '../index.ts';

export const loggedPagesFixtures = sharedTest.extend<
  {
    pixAdminRoleCertifPage: Page;
    pixCertifProPage: Page;
    pixCertifInvigilatorPage: Page;
    pixAppCertifiablePage: Page;
    pixOrgaProPage: Page;
  },
  {
    workerUniqueId: string;
    nextId: () => number;
    certifiableUserData: PixCertifiableUserData;
    pixCertifProUserData: PixCertifUserData;
    pixAdminRoleCertifUserData: PixAdminUserData;
    pixAdminRoleCertifWorkerContext: BrowserContext;
    pixCertifProWorkerContext: BrowserContext;
    pixOrgaProWorkerContext: BrowserContext;
    pixAppCertifiableWorkerContext: BrowserContext;
    makeUserCertifiableAndReadyForClea: void;
  }
>({
  pixAdminRoleCertifPage: async ({ pixAdminRoleCertifWorkerContext }, use) => {
    const page = await pixAdminRoleCertifWorkerContext.newPage();
    await page.goto(process.env.PIX_ADMIN_URL!);
    await use(page);
    await page.close();
  },
  pixOrgaProPage: async ({ pixOrgaProWorkerContext }, use) => {
    const page = await pixOrgaProWorkerContext.newPage();
    await page.goto(process.env.PIX_ORGA_URL!);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- need to let the fixture "makeUserCertifiableAndReadyForClea" so it is being called, but returns nothing
  pixAppCertifiablePage: async ({ pixAppCertifiableWorkerContext, makeUserCertifiableAndReadyForClea: _ }, use) => {
    const page = await pixAppCertifiableWorkerContext.newPage();
    // Force french origin, so PixPlus certification can be enrolled by candidate
    await page.route('**/api/**', (route) => {
      route.continue({
        headers: {
          ...route.request().headers(),
          origin: 'https://app.e2e.pix.fr',
        },
      });
    });
    await page.goto(process.env.PIX_APP_URL!);
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
      const workerOffset = (workerInfo.workerIndex + 1) * 10_000;

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
  certifiableUserData: [
    async ({ workerUniqueId, nextId }, use) => {
      const data = {
        id: nextId(),
        firstName: 'Buffy',
        lastName: 'Summers',
        email: `pix-app-user-${workerUniqueId}@example.net`,
        rawPassword: 'pix123',
        sex: 'F',
        birthdate: '1981-01-19',
        birthDay: '19',
        birthMonth: '01',
        birthYear: '1981',
        birthCountry: 'FRANCE',
        birthCity: 'Perpignan',
        postalCode: '66000',
      };
      await createUserInDB(
        {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          rawPassword: data.rawPassword,
          cgu: true,
          pixCertifTermsOfServiceAccepted: true,
          mustValidateTermsOfService: false,
        },
        knex,
      );
      await use(data);
    },
    { scope: 'worker' },
  ],
  pixCertifProUserData: [
    async ({ workerUniqueId, nextId }, use) => {
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
      await use(certifProUserData);
    },
    { scope: 'worker' },
  ],
  pixAdminRoleCertifUserData: [
    async ({ workerUniqueId, nextId }, use) => {
      const adminUserData: PixAdminUserData = {
        id: nextId(),
        firstName: 'pixAdminRoleCertif',
        lastName: `pixAdminRoleCertif${workerUniqueId}`,
        email: `pix-admin-role-certif-${workerUniqueId}@example.net`,
        rawPassword: 'pix123',
        role: 'CERTIF',
      };
      await buildPixAdminUser(knex, adminUserData);
      await use(adminUserData);
    },
    { scope: 'worker' },
  ],
  pixAdminRoleCertifWorkerContext: [
    async ({ workerUniqueId, browser, pixAdminRoleCertifUserData }, use) => {
      const credentials = {
        id: pixAdminRoleCertifUserData.id,
        label: `pix-admin-role-certif-${workerUniqueId}`,
        firstName: pixAdminRoleCertifUserData.firstName,
        lastName: pixAdminRoleCertifUserData.lastName,
        email: pixAdminRoleCertifUserData.email,
        rawPassword: pixAdminRoleCertifUserData.rawPassword,
        appUrl: process.env.PIX_ADMIN_URL!,
      };
      const context = await setupContext(browser, credentials, workerUniqueId);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixCertifProWorkerContext: [
    async ({ workerUniqueId, browser, pixCertifProUserData }, use) => {
      const credentials = {
        id: pixCertifProUserData.id,
        label: `pix-certif-pro-${workerUniqueId}`,
        firstName: pixCertifProUserData.firstName,
        lastName: pixCertifProUserData.lastName,
        email: pixCertifProUserData.email,
        rawPassword: pixCertifProUserData.rawPassword,
        appUrl: process.env.PIX_CERTIF_URL!,
      };
      const context = await setupContext(browser, credentials, workerUniqueId);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixOrgaProWorkerContext: [
    async ({ workerUniqueId, browser, pixCertifProUserData }, use) => {
      const credentials = {
        id: pixCertifProUserData.id,
        label: `pix-orga-pro-${workerUniqueId}`,
        firstName: pixCertifProUserData.firstName,
        lastName: pixCertifProUserData.lastName,
        email: pixCertifProUserData.email,
        rawPassword: pixCertifProUserData.rawPassword,
        appUrl: process.env.PIX_ORGA_URL!,
      };
      const context = await setupContext(browser, credentials, workerUniqueId);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixAppCertifiableWorkerContext: [
    async ({ workerUniqueId, browser, certifiableUserData }, use) => {
      const credentials = {
        id: certifiableUserData.id,
        label: `pix-app-certifiable-${workerUniqueId}`,
        firstName: certifiableUserData.firstName,
        lastName: certifiableUserData.lastName,
        email: certifiableUserData.email,
        rawPassword: certifiableUserData.rawPassword,
        appUrl: process.env.PIX_APP_URL!,
      };
      const context = await setupContext(browser, credentials, workerUniqueId);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  makeUserCertifiableAndReadyForClea: [
    async ({ pixAppCertifiableWorkerContext, pixOrgaProWorkerContext }, use) => {
      sharedTest.slow();

      const pixApp = await pixAppCertifiableWorkerContext.newPage();
      const pixOrgaProPage = await pixOrgaProWorkerContext.newPage();
      await pixOrgaProPage.goto(process.env.PIX_ORGA_URL!);
      const pixOrgaPage = new PixOrgaPage(pixOrgaProPage);
      let campaignCode: string | null;
      await sharedTest.step('creates the CLEA campaign', async () => {
        await pixOrgaProPage.getByRole('link', { name: 'Campagnes', exact: true }).click();
        await pixOrgaProPage.getByRole('link', { name: 'Créer une campagne' }).click();
        await pixOrgaPage.createEvaluationCampaign({
          campaignName: 'CLEA campagne',
          targetProfileName: 'Parcours complet CléA numérique',
        });
        campaignCode = await pixOrgaProPage.locator('dd.campaign-header-title__campaign-code > span').textContent();
      });

      await sharedTest.step('user enters campaign and answers correctly all the way to the end', async () => {
        await pixApp.goto(process.env.PIX_APP_URL!);
        await pixApp.getByRole('link', { name: "J'ai un code" }).click();
        const startCampaignPage = new StartCampaignPage(pixApp);
        await startCampaignPage.goToFirstChallenge(campaignCode as string);
        while (!pixApp.url().endsWith('/checkpoint?finalCheckpoint=true')) {
          const challengePage = new ChallengePage(pixApp);
          await challengePage.setRightOrWrongAnswer(true);
          await challengePage.validateAnswer();
          if (pixApp.url().includes('/checkpoint') && !pixApp.url().includes('finalCheckpoint=true')) {
            const checkpointPage = new IntermediateCheckpointPage(pixApp);
            await checkpointPage.goNext();
          }
        }
        const finalCheckpointPage = new FinalCheckpointPage(pixApp);
        await finalCheckpointPage.goToResults();
        await expect(pixApp.getByRole('paragraph').filter({ hasText: 'Vos résultats ont été envoyés' })).toBeVisible();
      });
      await pixApp.close();
      await use();
    },
    { scope: 'worker', timeout: 25_000 },
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
