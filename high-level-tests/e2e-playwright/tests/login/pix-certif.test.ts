import { Page } from '@playwright/test';

import { buildAuthenticatedUsers } from '../../helpers/db.ts';
import { PIX_CERTIF_PRO_DATA } from '../../helpers/db-data.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { LoginPage } from '../../pages/pix-certif/index.js';

test.beforeEach(async () => {
  await buildAuthenticatedUsers({ withCguAccepted: false });
});

test('login, cgu and logout', async ({ page }: { page: Page }) => {
  await page.goto(process.env.PIX_CERTIF_URL as string);

  await test.step('Login for the first time to PixCertif and accept CGUs', async () => {
    await expect(page.getByRole('heading')).toContainText('Connectez-vous');
    await expect(page.locator('header')).toContainText(
      "L'accès à Pix Certif est limité aux centres de certification Pix.",
    );

    const loginPage = new LoginPage(page);
    await loginPage.login(PIX_CERTIF_PRO_DATA.email, PIX_CERTIF_PRO_DATA.rawPassword);
    const cgu = page.getByRole('heading', {
      name: "Conditions générales d'utilisation de la plateforme Pix Certif",
    });
    await cgu.waitFor();
    await loginPage.acceptCGU();

    await expect(page).toHaveURL(/sessions$/);
  });

  await test.step('Logout and login, without having to accept CGU', async function () {
    await page.getByRole('link', { name: 'Se déconnecter' }).click();

    await expect(page.getByRole('heading')).toContainText('Connectez-vous');
    await expect(page.locator('header')).toContainText(
      "L'accès à Pix Certif est limité aux centres de certification Pix.",
    );

    const loginPage = new LoginPage(page);
    await loginPage.login(PIX_CERTIF_PRO_DATA.email, PIX_CERTIF_PRO_DATA.rawPassword);

    await expect(page).toHaveURL(/sessions$/);
  });
});
