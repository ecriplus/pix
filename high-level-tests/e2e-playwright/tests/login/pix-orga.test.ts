import { Page } from '@playwright/test';

import { buildFreshPixOrgaUser } from '../../helpers/db.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { LoginPage } from '../../pages/pix-orga/index.js';

test.beforeEach(async () => {
  await buildFreshPixOrgaUser('Buffy', 'Summers', 'buffy.summers.pixorga@example.net', 'Coucoulesdevs66', 'MEMBER');
});

test('login, cgu and logout', async ({ page }: { page: Page }) => {
  await page.goto(process.env.PIX_ORGA_URL as string);

  await test.step('Login for the first time to PixOrga and accept CGUs', async () => {
    await expect(page).toHaveTitle('Connectez-vous | Pix Orga (hors France)');

    const loginPage = new LoginPage(page);
    await loginPage.login('buffy.summers.pixorga@example.net', 'Coucoulesdevs66');
    const cgu = page.getByRole('heading', {
      name: "Veuillez accepter nos Conditions Générales d'Utilisation (CGU)",
    });
    await cgu.waitFor();
    await loginPage.acceptCGU();

    await expect(page).toHaveURL(/campagnes\/les-miennes$/);
  });

  await test.step('Logout and login, without having to accept CGU', async function () {
    await page.getByRole('link', { name: 'Se déconnecter' }).click();

    await expect(page).toHaveTitle('Connectez-vous | Pix Orga (hors France)');

    const loginPage = new LoginPage(page);
    await loginPage.login('buffy.summers.pixorga@example.net', 'Coucoulesdevs66');

    await expect(page).toHaveURL(/campagnes\/les-miennes$/);
  });
});
