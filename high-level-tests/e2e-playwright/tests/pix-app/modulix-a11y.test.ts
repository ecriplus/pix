import AxeBuilder from '@axe-core/playwright';

import { expect, test } from '../../helpers/fixtures.js';

test('test modulix-a11y', async ({ page }) => {
  await page.goto('http://localhost:4200/modules/b9414fc3/galerie/details');
  await page.getByRole('button', { name: 'Commencer le module' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Issue-report modal
  //await page.getByRole('button', { name: 'Envoyer un problème ou une' }).click();
  //await page.getByRole('button', { name: 'Raison du signalement' }).click();
  //await page.getByRole('option', { name: 'Le simulateur / l’application' }).click();
  //await page.getByRole('textbox', { name: 'Commentaire' }).click();
  //await page.getByRole('textbox', { name: 'Commentaire' }).fill('Ca ne marche pas.');
  //await page.getByRole('button', { name: 'Envoyer', exact: true }).click();
  //await page.getByRole('button', { name: 'Fermer' }).nth(1).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Expand
  await page.getByText('Clique-moi pour en savoir').click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Flashcards
  await test.step('flashcards', async () => {
    await page.getByRole('button', { name: 'Commencer', exact: true }).click();
    await page.getByRole('button', { name: 'Voir la réponse' }).click();
    await page.getByRole('button', { name: 'Presque' }).click();
    await page.getByRole('button', { name: 'Voir la réponse' }).click();
    await page.getByRole('button', { name: 'Oui !' }).click();
    await page.getByRole('button', { name: 'Voir la réponse' }).click();
    await page.getByRole('button', { name: 'Pas du tout' }).click();
    await page.getByRole('button', { name: 'Continuer' }).click();
  });

  // Display modal for alternative text of image element
  await page.getByRole('button', { name: "Afficher l'alternative" }).click();
  await page.getByRole('button', { name: 'Fermer' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // QAB
  await test.step('qab', async () => {
    await page.getByRole('button', { name: 'Option A: Vrai' }).click();
    await page.getByRole('button', { name: 'Option B: Faux' }).click();
    await page.getByRole('button', { name: 'Option B: Faux' }).click();
    await page.getByRole('button', { name: 'Passer l’activité' }).click();
  });

  // QCU
  await test.step('qcu', async () => {
    await page.getByLabel('Des recettes de lasagne').click();
    await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
    await page.waitForSelector('role=status');
    page.getByLabel('Incorrect.');
    await page.getByRole('button', { name: 'Réessayer' }).nth(1).click();
    await page.getByLabel('Des recettes végétariennes').click();
    await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
    await page.waitForSelector('role=status');
    page.getByLabel('Correct!');
    await page.getByRole('button', { name: 'Continuer' }).click();
  });

  // QCU Declarative
  await page.getByRole('button', { name: 'Après avoir mis le dentifrice' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // QCU Discovery
  await page.getByRole('button', { name: "Pour connaître l'ensemble des" }).click();
  await page.waitForSelector('role=status');
  await page.getByRole('button', { name: 'Continuer' }).click();

  // QCM
  await test.step('qcm', async () => {
    await page.getByLabel('Évaluer ses connaissances et').click();
    await page.getByText('Développer ses compétences').click();
    await page.getByLabel('Certifier ses compétences Pix').click();
    await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
    await page.waitForSelector('role=status');
    page.getByLabel('Correct!');
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByRole('button', { name: 'Passer l’activité' }).click();
    await page.getByRole('button', { name: 'Continuer' }).click();
  });

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);

  await page.getByRole('button', { name: 'Terminer' }).click();
});
