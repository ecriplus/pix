import { Page } from '@playwright/test';

import { getGarTokenForExistingUser } from '../../helpers/auth.ts';
import { buildFreshPixAppUser } from '../../helpers/db.js';
import { PIX_APP_USER_DATA } from '../../helpers/db-data.ts';
import { expect, test } from '../../helpers/fixtures.ts';
import { LoginPage } from '../../pages/pix-app/index.js';

test('Signup, logout and login', async ({ page, globalTestId }: { page: Page; globalTestId: string }) => {
  await page.goto(process.env.PIX_APP_URL as string);
  const email = `buffy.summers.${globalTestId}@example.net`;

  await test.step('Signup', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.signup('Buffy', 'Summers', email, 'Coucoulesdevs66');

    await expect(page.locator('#main')).toContainText('Bonjour Buffy');
    await expect(page).toHaveTitle('Accueil | Pix');
  });

  await test.step('Logout and login', async function () {
    await page.getByRole('button', { name: 'Buffy' }).click();
    await page.getByRole('link', { name: 'Se déconnecter' }).click();

    await expect(page).toHaveTitle('Connexion | Pix');

    const loginPage = new LoginPage(page);
    await loginPage.login(email, 'Coucoulesdevs66');

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

test('Accept the new terms of service', async ({ page, globalTestId }: { page: Page; globalTestId: string }) => {
  const email = `buffy.summers.${globalTestId}@example.net`;
  await buildFreshPixAppUser('Buffy', 'Summers', email, 'Coucoulesdevs66', true);

  await page.goto(process.env.PIX_APP_URL as string);

  await test.step('Login', async () => {
    await expect(page).toHaveTitle('Connexion | Pix');

    const loginPage = new LoginPage(page);
    await loginPage.login(email, 'Coucoulesdevs66');
  });

  await test.step('Revalidate terms of service', async function () {
    await expect(page.getByText("Nous avons mis à jour nos conditions d'utilisation")).toBeVisible();

    await page.getByRole('checkbox', { name: "J'accepte les conditions" }).check();
    await page.getByRole('button', { name: 'Je continue' }).click();

    await expect(page.locator('#main')).toContainText('Bonjour Buffy');
    await expect(page).toHaveTitle('Accueil | Pix');
  });
});
