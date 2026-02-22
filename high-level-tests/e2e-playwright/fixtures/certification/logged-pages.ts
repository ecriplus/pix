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

const pixAppBrowserContextsPerUser = new Map<number, BrowserContext>();
const pixAppPages: Page[] = [];

export const loggedPagesFixtures = sharedTest.extend<
  {
    pixAdminRoleCertifPage: Page;
    pixCertifProPage: Page;
    pixCertifInvigilatorPage: Page;
    pixOrgaProPage: Page;
    getCertifiableUserData: (i: number) => Promise<PixCertifiableUserData>;
  },
  {
    nextId: () => number;
    certifiableUserDatas: PixCertifiableUserData[];
    pixCertifProUserData: PixCertifUserData;
    pixAdminRoleCertifUserData: PixAdminUserData;
    pixAdminRoleCertifWorkerContext: BrowserContext;
    pixCertifProWorkerContext: BrowserContext;
    pixOrgaProWorkerContext: BrowserContext;
    pixAppCertifiableUserContext: (p: PixCertifiableUserData) => Promise<BrowserContext>;
    pixAppCertifiableUserPage: (p: PixCertifiableUserData) => Promise<Page>;
    makeUserCertifiableAndReadyForClea: (p: Page) => Promise<void>;
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
  getCertifiableUserData: async ({ certifiableUserDatas }, use) => {
    const getByIndex = async (index: number) => {
      return certifiableUserDatas[index];
    };
    await use(getByIndex);
  },
  nextId: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => {
      const shardOffset = (workerInfo.config.shard?.current ?? 0) * 100;
      const workerOffset = workerInfo.workerIndex + 1;
      const globalOffset = (shardOffset + workerOffset) * 1_000;

      function* idGenerator() {
        let counter = 0;
        while (true) {
          yield globalOffset + counter++;
        }
      }

      const generatorInstance = idGenerator();
      const nextId: () => number = () => generatorInstance.next().value!;

      await use(nextId);
    },
    { scope: 'worker' },
  ],
  certifiableUserDatas: [
    async ({ nextId }, use) => {
      const userDatas = [];
      let nextUserId = nextId();
      userDatas.push({
        id: nextUserId,
        firstName: 'Buffy',
        lastName: 'Summers',
        email: `pix-app-user-${nextUserId}-0@example.net`,
        rawPassword: 'pix123',
        sex: 'F',
        birthdate: '1981-01-19',
        birthDay: '19',
        birthMonth: '01',
        birthYear: '1981',
        birthCountry: 'FRANCE',
        birthCity: 'Perpignan',
        postalCode: '66000',
      });
      nextUserId = nextId();
      userDatas.push({
        id: nextUserId,
        firstName: 'Rupert',
        lastName: 'Giles',
        email: `pix-app-user-${nextUserId}-0@example.net`,
        rawPassword: 'pix123',
        sex: 'M',
        birthdate: '1955-02-22',
        birthDay: '22',
        birthMonth: '02',
        birthYear: '1955',
        birthCountry: 'FRANCE',
        birthCity: 'Perpignan',
        postalCode: '66000',
      });
      nextUserId = nextId();
      userDatas.push({
        id: nextUserId,
        firstName: 'Cordelia',
        lastName: 'Chase',
        email: `pix-app-user-${nextUserId}-0@example.net`,
        rawPassword: 'pix123',
        sex: 'F',
        birthdate: '1981-08-05',
        birthDay: '05',
        birthMonth: '08',
        birthYear: '1981',
        birthCountry: 'FRANCE',
        birthCity: 'Perpignan',
        postalCode: '66000',
      });
      for (const userData of userDatas) {
        await createUserInDB(
          {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            rawPassword: userData.rawPassword,
            cgu: true,
            pixCertifTermsOfServiceAccepted: true,
            mustValidateTermsOfService: false,
          },
          knex,
        );
      }
      await use(userDatas);
    },
    { scope: 'worker' },
  ],
  pixCertifProUserData: [
    async ({ nextId }, use) => {
      const nextUserId = nextId();
      const certifProUserData: PixCertifUserData = {
        id: nextUserId,
        firstName: 'pixCertifPro',
        lastName: `pixCertifPro${nextUserId}`,
        email: `pix-certif-pro-${nextUserId}@example.net`,
        rawPassword: 'pix123',
        certificationCenters: [
          {
            type: 'PRO',
            externalId: `CERTIFPRO${nextUserId}`,
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
    async ({ nextId }, use) => {
      const nextUserId = nextId();
      const adminUserData: PixAdminUserData = {
        id: nextUserId,
        firstName: 'pixAdminRoleCertif',
        lastName: `pixAdminRoleCertif${nextUserId}`,
        email: `pix-admin-role-certif-${nextUserId}@example.net`,
        rawPassword: 'pix123',
        role: 'CERTIF',
      };
      await buildPixAdminUser(knex, adminUserData);
      await use(adminUserData);
    },
    { scope: 'worker' },
  ],
  pixAdminRoleCertifWorkerContext: [
    async ({ browser, pixAdminRoleCertifUserData }, use) => {
      const credentials = {
        id: pixAdminRoleCertifUserData.id,
        label: `pix-admin-role-certif-${pixAdminRoleCertifUserData.id}`,
        firstName: pixAdminRoleCertifUserData.firstName,
        lastName: pixAdminRoleCertifUserData.lastName,
        email: pixAdminRoleCertifUserData.email,
        rawPassword: pixAdminRoleCertifUserData.rawPassword,
        appUrl: process.env.PIX_ADMIN_URL!,
      };
      const context = await setupContext(browser, credentials);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixCertifProWorkerContext: [
    async ({ browser, pixCertifProUserData }, use) => {
      const credentials = {
        id: pixCertifProUserData.id,
        label: `pix-certif-pro-${pixCertifProUserData.id}`,
        firstName: pixCertifProUserData.firstName,
        lastName: pixCertifProUserData.lastName,
        email: pixCertifProUserData.email,
        rawPassword: pixCertifProUserData.rawPassword,
        appUrl: process.env.PIX_CERTIF_URL!,
      };
      const context = await setupContext(browser, credentials);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixOrgaProWorkerContext: [
    async ({ browser, pixCertifProUserData }, use) => {
      const credentials = {
        id: pixCertifProUserData.id,
        label: `pix-orga-pro-${pixCertifProUserData.id}`,
        firstName: pixCertifProUserData.firstName,
        lastName: pixCertifProUserData.lastName,
        email: pixCertifProUserData.email,
        rawPassword: pixCertifProUserData.rawPassword,
        appUrl: process.env.PIX_ORGA_URL!,
      };
      const context = await setupContext(browser, credentials);
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
  pixAppCertifiableUserContext: [
    async ({ browser, makeUserCertifiableAndReadyForClea }, use) => {
      const createContextForUser = async (certifiableUserData: PixCertifiableUserData) => {
        if (pixAppBrowserContextsPerUser.has(certifiableUserData.id)) {
          return pixAppBrowserContextsPerUser.get(certifiableUserData.id)!;
        }
        const credentials = {
          id: certifiableUserData.id,
          label: `pix-app-certifiable-${certifiableUserData.id}`,
          firstName: certifiableUserData.firstName,
          lastName: certifiableUserData.lastName,
          email: certifiableUserData.email,
          rawPassword: certifiableUserData.rawPassword,
          appUrl: process.env.PIX_APP_URL!,
        };
        const context = await setupContext(browser, credentials);
        pixAppBrowserContextsPerUser.set(certifiableUserData.id, context);
        const page = await context.newPage();
        await makeUserCertifiableAndReadyForClea(page);
        await page.close();
        return context;
      };
      await use(createContextForUser);
      for (const browser of pixAppBrowserContextsPerUser.values()) {
        await browser.close();
      }
    },
    { scope: 'worker' },
  ],
  pixAppCertifiableUserPage: [
    async ({ pixAppCertifiableUserContext }, use) => {
      const createPageForUser = async (certifiableUserData: PixCertifiableUserData) => {
        const browser = await pixAppCertifiableUserContext(certifiableUserData);
        const page = await browser.newPage();
        pixAppPages.push(page);
        await page.route('**/api/**', (route) => {
          route.continue({
            headers: {
              ...route.request().headers(),
              origin: 'https://app.e2e.pix.fr',
            },
          });
        });
        await page.goto(process.env.PIX_APP_URL!);
        return page;
      };
      await use(createPageForUser);
      for (const page of pixAppPages) {
        await page.close();
      }
    },
    { scope: 'worker' },
  ],
  makeUserCertifiableAndReadyForClea: [
    async ({ pixOrgaProWorkerContext }, use) => {
      const prepareUser = async (pixApp: Page) => {
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
          await expect(
            pixApp.getByRole('paragraph').filter({ hasText: 'Vos résultats ont été envoyés' }),
          ).toBeVisible();
        });
      };
      await use(prepareUser);
    },
    { scope: 'worker' },
  ],
});

async function setupContext(browser: Browser, credentials: Credentials) {
  await saveStorageState(credentials);

  const authFilePath = path.join(AUTH_DIR, `${credentials.label}.json`);
  const harFilePath = path.join(HAR_DIR, `${credentials.label}.har`);
  const recordHar = shouldRecordHAR
    ? {
        path: harFilePath,
        content: 'omit' as const,
      }
    : undefined;
  return browser.newContext({ storageState: authFilePath, recordHar });
}
