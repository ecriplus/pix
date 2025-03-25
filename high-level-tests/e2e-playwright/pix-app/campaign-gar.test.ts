import { expect } from '@playwright/test';

import { getGarTokenForNewUser } from '../helpers/auth.js';
import { databaseBuilder } from '../helpers/db.js';
import { test } from '../helpers/fixtures.js';

test('creates an account from GAR', async ({ page }) => {
  const user = databaseBuilder.factory.buildUser();
  const campaign = databaseBuilder.factory.buildCampaign();
  await databaseBuilder.commit();

  const garUserToken = getGarTokenForNewUser(user.firstName, user.lastName);
  await page.goto(`/campagnes/?externalUser=${garUserToken}`);
  await expect(page.getByRole('heading', { name: 'Saisissez votre code' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Saisir votre code pour' }).fill(campaign.code);
  await page.getByRole('button', { name: 'Accéder au parcours' }).click();
  await expect(page.getByRole('heading', { name: 'Commencez votre parcours Pix' })).toBeVisible();
});
