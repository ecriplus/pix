import { expect } from '@playwright/test';

import { databaseBuilder } from '../helpers/db.ts';
import { test } from '../helpers/fixtures.ts';

let invitation: { id: string; code: string };
const email = 'admin@example.net';

test.beforeEach(async function () {
  invitation = databaseBuilder.factory.buildOrganizationInvitation({
    email,
  });
  await databaseBuilder.commit();
});

test('Join an organization without having an account', async function ({ page }) {
  await page.goto(`/rejoindre?invitationId=${invitation.id}&code=${invitation.code}`);
  await expect(page.getByText('Vous êtes invité(e) à')).toBeVisible();
  await page.getByRole('textbox', { name: 'Prénom' }).fill('mini');
  await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('pixou');
  await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill('minipixou@example.net');
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill('Azerty123*');
  await page.getByRole('checkbox', { name: "Accepter les conditions d'utilisation de Pix" }).check();
  await page.getByRole('button', { name: "Je m'inscris" }).click();
  await page.getByRole('heading', { name: "Veuillez accepter nos Conditions Générales d'Utilisation" }).waitFor();
  await page.getByRole('button', { name: 'Accepter et continuer' }).click();
  await expect(page.getByRole('heading', { name: 'Campagnes' })).toBeVisible();
});
