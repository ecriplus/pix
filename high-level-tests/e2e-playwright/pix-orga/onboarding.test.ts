import { expect } from '@playwright/test';

import { useLoggedUser } from '../helpers/auth.ts';
import { databaseBuilder } from '../helpers/db.ts';
import { test } from '../helpers/fixtures.ts';

test.describe('when user is not authenticated', () => {
  test('Join an organization without having an account', async function ({ page }) {
    const invitation = databaseBuilder.factory.buildOrganizationInvitation();
    await databaseBuilder.commit();

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

  test('Join an organization with an existing account', async function ({ page }) {
    const invitation = databaseBuilder.factory.buildOrganizationInvitation();
    databaseBuilder.factory.buildUser.withRawPassword({
      email: 'random-account@example.net',
    });
    await databaseBuilder.commit();

    await page.goto(`/rejoindre?invitationId=${invitation.id}&code=${invitation.code}`);

    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill('random-account@example.net');
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill('pix123');
    await page.getByRole('button', { name: 'Je me connecte' }).click();
    await expect(
      page.getByRole('heading', { name: "Veuillez accepter nos Conditions Générales d'Utilisation" }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Accepter et continuer' }).click();
    await expect(page.getByRole('heading', { name: 'Campagnes' })).toBeVisible();
  });
});

test.describe('when user is authenticated', () => {
  const userId = useLoggedUser('pix-orga');

  test('Join an organization with an existing account', async function ({ page }) {
    const invitation = databaseBuilder.factory.buildOrganizationInvitation();
    databaseBuilder.factory.buildUser.withMembership({
      id: userId,
      email: 'already-connected@example.net',
    });
    await databaseBuilder.commit();

    await page.goto(`/rejoindre?invitationId=${invitation.id}&code=${invitation.code}`);
    test.step('signing user', async () => {
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill('already-connected@example.net');
      await page.getByRole('textbox', { name: 'Mot de passe' }).fill('pix123');
      await page.getByRole('button', { name: 'Je me connecte' }).click();
    });

    await expect(
      page.getByRole('heading', { name: "Veuillez accepter nos Conditions Générales d'Utilisation" }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Accepter et continuer' }).click();
    await expect(page.getByRole('heading', { name: 'Campagnes' })).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Observatoire de Pix' })).toBeVisible();
  });
});
