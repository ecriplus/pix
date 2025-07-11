import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { getGarTokenForExistingUser } from '../../helpers/auth.ts';
import { buildFreshPixOrgaUser, createGARUser } from '../../helpers/db.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { PixOrgaPage } from '../../pages/pix-orga/PixOrgaPage.ts';

let UAJ: string;
let GARUserId: number;

test.beforeEach(async () => {
  UAJ = randomUUID().slice(-8);
  GARUserId = await createGARUser(UAJ, 'stéphanie', 'chaire', true);
  await buildFreshPixOrgaUser('Adi', 'Minh', `admin-${UAJ}@example.net`, 'pix123', 'ADMIN', {
    type: 'SCO',
    externalId: `SCO_MANAGING-${UAJ}`,
    isManagingStudents: true,
  });

  let file = (await readFile(path.join(import.meta.dirname, '..', '..', 'fixtures', 'sco-ok.xml'))).toString();
  let count = 1;
  file = file
    .replace(/<UAJ>.*<\/UAJ>/, `<UAJ>SCO_MANAGING-${UAJ}</UAJ>`)
    .replace(/<ID_NATIONAL>([\d]+)<\/ID_NATIONAL>/g, () => `/<ID_NATIONAL>${UAJ}-${count++}</ID_NATIONAL>`);

  await writeFile(path.join(os.tmpdir(), `sco-${UAJ}.xml`), file);
});

test('Manage sco learners', async ({ page }) => {
  let campaignCode: string;
  const orgaPage = new PixOrgaPage(page);

  await test.step('Login to pixOrga', async () => {
    await page.goto(process.env.PIX_ORGA_URL as string);
    await orgaPage.login(`admin-${UAJ}@example.net`, 'pix123');
    await page.getByRole('button').filter({ hasText: 'Je me connecte' }).waitFor({ state: 'detached' });
    await orgaPage.acceptCGU();
  });

  await test.step('Create a campaign', async () => {
    await page.getByRole('link', { name: 'Campagnes', exact: true }).click();
    await page.getByRole('link', { name: 'Créer une campagne' }).click();
    await orgaPage.createEvaluationCampaign({
      campaignName: 'campagne sco',
      targetProfileName: 'PC pour Playwright',
    });
    campaignCode = (await page.locator('dd.campaign-header-title__campaign-code > span').textContent()) ?? '';
  });

  await test.step('Import Learners', async () => {
    await page.getByRole('link', { name: 'Élèves' }).click();
    await page.getByRole('link', { name: 'Importer', exact: true }).click();
    await page.getByRole('button', { name: 'Importer la liste' }).click();
    await page
      .getByRole('textbox', { name: 'Importer la liste' })
      .setInputFiles(path.join(os.tmpdir(), `sco-${UAJ}.xml`));

    const hasLoader = await page.locator('.app-loader').isVisible();
    if (hasLoader) {
      await page.waitForSelector('.app-loader', { state: 'detached' });
    }

    await page.getByRole('link', { name: 'Élèves' }).click();
    await orgaPage.waitForUploadSuccess(page);
    await expect(
      page.getByRole('paragraph').filter({ hasText: 'Les participants ont bien été importés' }),
    ).toBeVisible();
  });

  await test.step('Log in using the campaign code', async function () {
    await page.goto(process.env.PIX_APP_URL + `/campagnes/${campaignCode}`);
    await page.getByRole('button', { name: 'Je commence' }).click();
    await page.getByRole('textbox', { name: 'Prénom *' }).fill('Jaqueline');
    await page.getByRole('textbox', { name: 'Nom *', exact: true }).fill(`Colson`);
    await page.getByRole('spinbutton', { name: 'Jour de naissance' }).fill('03');
    await page.getByRole('spinbutton', { name: 'Mois de naissance' }).fill('09');
    await page.getByRole('spinbutton', { name: 'Année de naissance' }).fill('1994');
    await page.getByRole('button', { name: "Je m'inscris" }).click();
    await expect(page.getByText('Mon identifiant *')).toBeVisible();
    await page.getByRole('textbox', { name: 'Mot de passe * (8 caractères' }).fill('Pix12345');
    await page.getByRole('button', { name: 'Afficher le mot de passe' }).click();
    await page.getByRole('button', { name: "Je m'inscris" }).click();
    await expect(page.getByText('Vous pouvez rechercher sur')).toBeVisible();
  });

  await test.step('Log in using GAR', async function () {
    const token = getGarTokenForExistingUser(GARUserId);
    await page.goto(process.env.PIX_APP_URL + `/connexion/gar#${token}`);
    await expect(page.getByRole('link', { name: "J'ai un code" })).toBeVisible();
    await page.getByRole('link', { name: "J'ai un code" }).click();
    await page.getByLabel('Saisir votre code pour').fill(campaignCode);
    await page.getByRole('button', { name: 'Accéder au parcours' }).click();
    await page.getByRole('button', { name: 'Je commence' }).click();
    await expect(page.getByRole('heading', { name: "Rejoignez l'organisation Orga" })).toBeVisible();
    await page.getByRole('textbox', { name: 'Prénom' }).fill('Stéphanie');
    await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('Chaire');
    await page.getByRole('textbox', { name: 'jour de naissance' }).fill('03');
    await page.getByRole('textbox', { name: 'mois de naissance' }).fill('10');
    await page.getByRole('textbox', { name: 'année de naissance' }).fill('1994');
    await page.getByRole('button', { name: "C'est parti !" }).click();
    await page.getByRole('button', { name: 'Associer' }).click();
    await page.getByRole('button', { name: 'Ignorer' }).click();
  });

  await test.step('Show learners', async () => {
    await page.goto(process.env.PIX_ORGA_URL as string);
    await page.getByRole('link', { name: 'Élèves' }).click();

    await expect(
      page.getByRole('paragraph').filter({ hasText: 'Les participants ont bien été importés' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Élèves (3)' })).toBeVisible();
  });

  await test.step('Generate learner password ', async () => {
    await expect(page.getByRole('table', { name: 'Tableau des élèves trié' })).toBeVisible();
    const row = page.getByRole('row').filter({ hasText: 'Identifiant' });
    await row.getByRole('button', { name: 'Afficher les actions' }).click();
    await row.getByRole('button', { name: 'Gérer le compte' }).click();

    const dialog = page.getByRole('dialog', { name: 'Gestion du compte Pix de l’élève' });
    await expect(dialog.getByRole('heading', { name: 'Identifiant' })).toBeVisible();

    await dialog.getByRole('button', { name: 'Réinitialiser le mot de passe' }).click();
    await expect(dialog.getByText('Nouveau mot de passe à usage')).toBeVisible();
    await dialog.getByRole('button', { name: 'Fermer' }).click();
  });

  await test.step('Generate learner password for GAR authenticated learner', async () => {
    await expect(page.getByRole('table', { name: 'Tableau des élèves trié' })).toBeVisible();
    const row = page.getByRole('row').filter({ hasText: 'Mediacentre' });
    await row.getByRole('button', { name: 'Afficher les actions' }).click();
    await row.getByRole('button', { name: 'Gérer le compte' }).click();

    const dialog = page.getByRole('dialog', { name: 'Gestion du compte Pix de l’élève' });
    await expect(dialog.getByText('Médiacentre')).toBeVisible();
    await dialog.getByRole('button', { name: 'Ajouter l’identifiant' }).click();
    await expect(dialog.getByText('Nouveau mot de passe à usage')).toBeVisible();
    await dialog.getByRole('button', { name: 'Fermer' }).click();
  });

  await test.step('No action available for learner not linked to a user', async () => {
    await expect(page.getByRole('table', { name: 'Tableau des élèves trié' })).toBeVisible();
    const row = page.getByRole('row').filter({ hasText: 'Bernard' });
    await expect(row.getByRole('button', { name: 'Afficher les actions' })).not.toBeVisible();
  });
});
