import { buildFreshPixAppUser, createOrganizationInDB, createTargetProfileInDB, knex } from '../../helpers/db.js';
import { expect, test } from '../../helpers/fixtures.js';

test('pass a combined course as sco user and see the final result', async ({ page }) => {
  const TARGET_PROFILE_TUBES = [
    {
      id: 'recSqw34xWSLgEgt',
      level: 1,
    },
  ];
  const CAMPAIGN_SKILLS = ['rec1aqbvWEqtoMOLw'];
  const email = 'alain.terieur@example.net';
  const firstName = 'Alain';
  const lastName = 'Terieur';
  const birthdate = new Date('2010-07-10');
  const userId = await buildFreshPixAppUser(firstName, lastName, email, 'pix123', false);
  const organizationId = await createOrganizationInDB({ type: 'SCO', externalId: '123', isManagingStudents: true });
  await knex('organization-learners').insert({ firstName, lastName, birthdate, organizationId });
  const targetProfileId = await createTargetProfileInDB('targetProfile');
  const [{ id: campaignId }] = await knex('campaigns')
    .insert({
      targetProfileId,
      name: 'campagne diag',
      code: 'ASSDIAG12',
      organizationId,
      creatorId: userId,
      ownerId: userId,
      type: 'ASSESSMENT',
      customResultPageButtonText: 'Continuer',
      customResultPageButtonUrl: 'http://localhost:4200/parcours/COMBINIX1',
    })
    .returning('id');
  await knex('campaign_skills').insert({ campaignId, skillId: CAMPAIGN_SKILLS[0] });
  await knex('target-profile_tubes').insert({
    targetProfileId,
    level: TARGET_PROFILE_TUBES[0].level,
    tubeId: TARGET_PROFILE_TUBES[0].id,
  });
  const [{ id: trainingId }] = await knex('trainings')
    .insert({
      title: 'demo combinix 1',
      link: '/modules/demo-combinix-1',
      type: 'modulix',
      duration: 1,
      locale: 'fr',
      editorName: 'demo',
      editorLogoUrl: 'demo',
    })
    .returning('id');

  const moduleId1 = 'eeeb4951-6f38-4467-a4ba-0c85ed71321a';
  await knex('target-profile-trainings').insert({ targetProfileId, trainingId });
  await knex('training-triggers').insert({ trainingId, threshold: 0, type: 'prerequisite' });
  await knex('training-triggers').insert({ trainingId, threshold: 100, type: 'goal' });

  const successRequirements = JSON.stringify([
    {
      requirement_type: 'campaignParticipations',
      comparison: 'all',
      data: {
        campaignId: {
          data: campaignId,
          comparison: 'equal',
        },
        status: {
          data: 'SHARED',
          comparison: 'equal',
        },
      },
    },
    {
      requirement_type: 'passages',
      comparison: 'all',
      data: {
        moduleId: {
          data: moduleId1,
          comparison: 'equal',
        },
        isTerminated: {
          data: true,
          comparison: 'equal',
        },
      },
    },
  ]);
  const eligibilityRequirements = JSON.stringify([]);
  await knex('quests').insert({ code: 'COMBINIX1', organizationId, successRequirements, eligibilityRequirements });

  await page.goto('http://localhost:4200/parcours/COMBINIX1/');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByRole('textbox', { name: 'Adresse e-mail ou identifiant' }).fill('alain.terieur@example.net');
  await page.getByRole('textbox', { name: 'Mot de passe *' }).fill('pix123');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByRole('textbox', { name: 'Prénom' }).fill('Alain');
  await page.getByRole('textbox', { name: 'Nom', exact: true }).fill('Terieur');
  await page.getByRole('textbox', { name: 'jour de naissance' }).fill('10');
  await page.getByRole('textbox', { name: 'mois de naissance' }).fill('07');
  await page.getByRole('textbox', { name: 'année de naissance' }).fill('2010');
  await page.getByRole('button', { name: "C'est parti !" }).click();
  await page.getByRole('button', { name: 'Associer' }).click();
  await page.getByRole('button', { name: 'Commencer mon parcours' }).click();
  await page.getByRole('link', { name: 'campagne diag' }).click();
  await page.getByRole('button', { name: 'Je commence' }).click();
  await page.getByRole('button', { name: 'Ignorer' }).click();
  await page.getByRole('button', { name: 'Je passe et je vais à la' }).click();
  //Le bouton "Voir mes résultats" existe deux fois à ce moment, on doit donc faire autrement en attendant de corriger cette page
  await page.locator('#ember138').click();
  await page.getByRole('button', { name: "J'envoie mes résultats" }).click();
  await page.getByRole('button', { name: 'Fermer', exact: true }).click();
  await page.getByRole('link', { name: 'Continuer' }).click();
  await page.getByRole('link', { name: 'Demo combinix' }).click();
  await page.getByRole('button', { name: 'Commencer le module' }).click();
  await page.getByRole('button', { name: 'Terminer' }).click();
  //Sera enlevé au prochain ticket pour passer l'url en relative, on aura plus les problèmes liés à l'host
  await page.goto('http://localhost:4200/parcours/COMBINIX1/');
  await expect(page.getByRole('heading', { name: 'Félicitations ! Vous avez terminé !' })).toBeVisible();
});
