import { expect } from '@playwright/test';

import { useLoggedUser } from '../helpers/auth.ts';
import { databaseBuilder } from '../helpers/db.ts';
import { test } from '../helpers/fixtures.ts';

const userId = useLoggedUser('pix-orga');

test('homepage', async ({ page }) => {
  databaseBuilder.factory.buildUser.withMembership({ id: userId });
  await databaseBuilder.commit();

  await page.goto('/');

  const cgu = page.getByRole('heading', { name: "Veuillez accepter nos Conditions Générales d'Utilisation (CGU)" });
  await cgu.waitFor();

  await page.getByRole('button', { name: 'Accepter et continuer' }).click();
  await expect(page.getByRole('heading', { name: 'Campagnes' })).toBeVisible();
});
