import { Page } from '@playwright/test';

import { buildAuthenticatedUsers } from '../../helpers/db.ts';
import { PIX_ORGA_PRO_DATA } from '../../helpers/db-data.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { LoginPage } from '../../pages/pix-orga/index.js';

test.beforeEach(async () => {
  await buildAuthenticatedUsers({ withCguAccepted: false });
});

test('login, cgu and logout', async ({ page }: { page: Page }) => {
  await page.goto(process.env.PIX_ORGA_URL as string);

  await test.step('Login for the first time to PixOrga and accept CGUs', async () => {
    await expect(page).toHaveTitle('Connectez-vous | Pix Orga (hors France)');

    const loginPage = new LoginPage(page);
    await loginPage.login(PIX_ORGA_PRO_DATA.email, PIX_ORGA_PRO_DATA.rawPassword);
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
    await loginPage.login(PIX_ORGA_PRO_DATA.email, PIX_ORGA_PRO_DATA.rawPassword);

    await expect(page).toHaveURL(/campagnes\/les-miennes$/);
  });
});
