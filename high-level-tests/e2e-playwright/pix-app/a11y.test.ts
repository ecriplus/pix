import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

import { useLoggedUser } from '../helpers/auth.ts';
import { databaseBuilder } from '../helpers/db.ts';
import { test } from '../helpers/fixtures.ts';

const userId = useLoggedUser('pix-app');

const routes = [
  { path: '/accueil', title: 'Accueil | Pix' },
  { path: '/campagnes', title: "J'ai un code | Pix" },
  { path: '/certifications', title: 'Rejoindre une session de certification | Pix' },
  { path: '/competences', title: 'Compétences | Pix' },
  { path: '/mes-certifications', title: 'Mes certifications | Pix' },
  { path: '/mes-formations', title: 'Mes formations | Pix' },
];

routes.forEach(({ path, title }) => {
  test(`check a11y for route ${path}`, async ({ page }) => {
    databaseBuilder.factory.buildUser.withRawPassword({ id: userId });
    await databaseBuilder.commit();

    await page.goto(path);
    await expect(page).toHaveTitle(title);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
