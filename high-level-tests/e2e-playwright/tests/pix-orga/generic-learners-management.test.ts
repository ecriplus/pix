import { randomUUID } from 'node:crypto';
import path from 'node:path';

import { buildFreshPixOrgaUserWithGenericImport, deleteUserFromDB, knex } from '../../helpers/db.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { LoginPage } from '../../pages/pix-app/index.ts';
import { PixOrgaPage } from '../../pages/pix-orga/index.ts';

let uid: string;
let testData: {
  userId: number;
  targetProfileId: number;
  campaignCode: string;
  campaignId: number;
  organizationId: number;
};

test.beforeEach(async () => {
  uid = randomUUID().slice(-8);
  testData = await buildFreshPixOrgaUserWithGenericImport(
    'Adi',
    'Minh',
    `admin-${uid}@example.net`,
    'pix123',
    'ADMIN',
    {
      type: 'PRO',
      externalId: `GENERIC_ORG-${uid}`,
      isManagingStudents: false,
    },
  );
});

test.afterEach(async () => {
  const { userId, organizationId, campaignId } = testData;

  // Get participation id
  const { id: campaignParticipationId } = await knex('campaign-participations')
    .where('campaignId', testData.campaignId)
    .first();

  // Get assessment id
  const { id: assessmentId } = await knex
    .from('assessments')
    .select('id')
    .where('campaignParticipationId', campaignParticipationId)
    .first();

  await knex('assessment-results').where('assessmentId', assessmentId).delete();
  await knex('assessments').where('id', assessmentId).delete();
  await knex('answers').where('assessmentId', assessmentId).delete();
  await knex('campaign-participations').where('id', campaignParticipationId).delete();
  await knex('organization-learners').where('organizationId', organizationId).delete();
  await knex('campaigns').where('id', campaignId).delete();
  const organizationFeatureIds = await knex('organization-features')
    .where('organizationId', organizationId)
    .pluck('id');
  await knex('organization-features').whereIn('id', organizationFeatureIds).delete();
  await knex('organization-learner-import-formats').where('createdBy', userId).delete();
  await knex('target-profile-shares').where('organizationId', organizationId).delete();
  await knex('memberships').where('userId', userId).delete();
  await knex('organization-imports').where('organizationId', organizationId).delete();
  const { id: asimovUserId } = await knex('users').where('email', `asimov.${uid}@example.net`).select('id').first();
  await deleteUserFromDB(asimovUserId);
  await deleteUserFromDB(userId);
  const administrationTeamId = await knex('organizations')
    .where('id', organizationId)
    .select('administrationTeamId')
    .first()
    .then((row) => row?.administrationTeamId);
  await knex('organizations').where('id', organizationId).delete();
  await knex('administration_teams').where('id', administrationTeamId).delete();
});

test('Managing generic import learners', async ({ page }) => {
  test.slow();
  const orgaPage = new PixOrgaPage(page);

  await test.step('Login to pixOrga', async () => {
    await page.goto(process.env.PIX_ORGA_URL as string);
    await orgaPage.login(`admin-${uid}@example.net`, 'pix123');
    await page.getByRole('button').filter({ hasText: 'Je me connecte' }).waitFor({ state: 'detached' });
    await orgaPage.acceptCGU();
  });

  await test.step('Import learners', async () => {
    await page.getByRole('link', { name: 'Participants' }).click();
    await page.getByRole('link', { name: 'Importer', exact: true }).click();
    await page
      .locator('#students-file-upload')
      .setInputFiles(path.join(import.meta.dirname, '..', '..', 'fixtures', 'generic-ok.csv'));

    const hasLoader = await page.locator('.app-loader').isVisible();
    if (hasLoader) {
      await page.waitForSelector('.app-loader', { state: 'detached' });
    }

    await page.getByRole('link', { name: 'Participants' }).click();
    await orgaPage.waitForUploadSuccess(page);
  });

  await test.step('Access the campaign and reconcile a new user with an imported learner', async () => {
    // Access campaign
    await page.goto(process.env.PIX_APP_URL as string);
    const loginPage = new LoginPage(page);
    await loginPage.signup('Isaac', 'Asimov', `asimov.${uid}@example.net`, 'oaiejf*(Uo;aise9821');
    await page.getByRole('link', { name: "J'ai un code" }).click();
    await page.getByLabel('Saisir votre code pour').fill(testData.campaignCode);
    await page.getByRole('button', { name: 'Accéder au parcours' }).click();
    await page.getByRole('button', { name: 'Je commence' }).click();

    // Wait for reconciliation page
    await expect(page.getByRole('heading', { name: /Orga pro/ })).toBeVisible();

    // Fill in the reconciliation form
    await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('Charlie');
    await page.getByRole('textbox', { name: 'Prénom' }).fill('Bernard');
    await page.getByLabel('Date de naissance').fill('10/10/2010');

    // Submit the form
    await page.getByRole('button', { name: "C'est parti" }).click();

    // Start (and end) campaign
    await page.getByRole('button', { name: 'Ignorer' }).click();
    await expect(page.getByRole('heading', { name: 'Vous avez déjà répondu' })).toBeVisible();
  });
});
