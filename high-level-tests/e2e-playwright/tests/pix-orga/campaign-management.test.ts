import { randomUUID } from 'node:crypto';

import { buildFreshPixOrgaUser } from '../../helpers/db.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { PixOrgaPage } from '../../pages/pix-orga/PixOrgaPage.ts';

let uid: string;

test.beforeEach(async () => {
  uid = randomUUID().slice(-8);
  await buildFreshPixOrgaUser('Adi', 'Minh', `admin-${uid}@example.net`, 'pix123', 'ADMIN', {
    type: 'PRO',
    externalId: `PRO_MANAGING-${uid}`,
    isManagingStudents: false,
  });
});

test('Assessment campaign', async ({ page }) => {
  const orgaPage = new PixOrgaPage(page);

  await test.step('Login to pixOrga', async () => {
    await page.goto(process.env.PIX_ORGA_URL as string);
    await orgaPage.login(`admin-${uid}@example.net`, 'pix123');
    await page.getByRole('button').filter({ hasText: 'Je me connecte' }).waitFor({ state: 'detached' });
    await orgaPage.acceptCGU();
  });

  await test.step('Create a campaign', async () => {
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await page.getByRole('link', { name: 'Créer une campagne' }).click();
    await orgaPage.createEvaluationCampaign({
      campaignName: 'campagne pro',
      targetProfileName: 'PC pour Playwright',
    });
  });

  await test.step('Duplicate campaign details', async () => {
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await page.getByRole('link', { name: 'campagne pro' }).click();
    await page.getByRole('link', { name: 'Paramètres' }).click();
    await page.getByRole('link', { name: 'Dupliquer' }).click();
    await page.getByRole('button', { name: 'Créer la campagne' }).click();
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await expect(page.getByRole('link', { name: 'Copie de campagne pro' })).toBeVisible();
  });

  await test.step('Update campaign details', async () => {
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await page.getByRole('link', { name: 'Copie de campagne pro' }).click();
    await page.getByRole('link', { name: 'Paramètres' }).click();
    await page.getByRole('link', { name: 'Modifier' }).click();
    await page.getByRole('textbox', { name: 'Nom de la campagne *' }).fill('campagne pro 2');
    await page.getByRole('button', { name: 'Modifier' }).click();
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await expect(page.getByRole('link', { name: 'campagne pro 2' })).toBeVisible();
  });

  await test.step('Archive/unarchive campaign', async function () {
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await page.getByRole('link', { name: 'campagne pro 2' }).click();
    await page.getByRole('link', { name: 'Paramètres' }).click();
    await page.getByRole('button', { name: 'Archiver' }).click();
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await expect(page.getByRole('link', { name: 'campagne pro 2' })).not.toBeVisible();
    await page.getByRole('button', { name: 'Afficher les campagnes' }).click();
    await expect(page.getByRole('link', { name: 'campagne pro' })).toBeVisible();
    await page.getByRole('link', { name: 'campagne pro' }).click();
    await page.getByRole('button', { name: 'Désarchiver la campagne' }).click();
    await page.getByLabel('Navigation principale').getByRole('link', { name: 'Campagnes' }).click();
    await expect(page.getByRole('link', { name: 'campagne pro 2' })).toBeVisible();
  });
});
