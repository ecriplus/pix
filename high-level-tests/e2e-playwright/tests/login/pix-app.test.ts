import { Page } from '@playwright/test';

import { getGarTokenForExistingUser } from '../../helpers/auth.ts';
import { PIX_APP_USER_DATA } from '../../helpers/db-data.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { LoginPage } from '../../pages/pix-app/index.js';

test('Signup, logout and login', async ({ page }: { page: Page }) => {
  await page.goto(process.env.PIX_APP_URL as string);

  await test.step('Signup', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.signup('Buffy', 'Summers', 'buffy.summers.pixapp@example.net', 'Coucoulesdevs66');

    await expect(page.locator('#main')).toContainText('Bonjour Buffy');
    await expect(page).toHaveTitle('Accueil | Pix');
  });

  await test.step('Logout and login', async function () {
    await page.getByRole('button', { name: 'Buffy' }).click();
    await page.getByRole('link', { name: 'Se déconnecter' }).click();

    await expect(page).toHaveTitle('Connexion | Pix');

    const loginPage = new LoginPage(page);
    await loginPage.login('buffy.summers.pixapp@example.net', 'Coucoulesdevs66');

    await expect(page.locator('#main')).toContainText('Bonjour Buffy');
    await expect(page).toHaveTitle('Accueil | Pix');
  });
});

test('Login as existing GAR user and logout', async ({ page }) => {
  const token = getGarTokenForExistingUser(PIX_APP_USER_DATA.id);
  await page.goto(process.env.PIX_APP_URL + `/connexion/gar#${token}`);

  await expect(page).toHaveTitle('Accueil | Pix');

  await page.getByRole('button', { name: PIX_APP_USER_DATA.firstName }).click();
  await page.getByRole('link', { name: 'Se déconnecter' }).click();

  await expect(page.locator('main')).toContainText('Vous êtes bien déconnecté(e).');
});
