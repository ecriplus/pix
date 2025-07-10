import { BrowserContext, Page } from '@playwright/test';

import { knex, setAssessmentIdSequence } from '../../helpers/db.js';
import { expect, expectOrRecordResults, test, TEST_MODE } from '../../helpers/fixtures.ts';
import { rightWrongAnswerCycle } from '../../helpers/utils.ts';
import {
  CampaignResultsPage,
  ChallengePage,
  FinalCheckpointPage,
  IntermediateCheckpointPage,
  LoginPage,
  StartCampaignPage,
} from '../../pages/pix-app/index.ts';
import { PixOrgaPage } from '../../pages/pix-orga/index.ts';

let COMPETENCE_TITLES: string[];
test.beforeEach(async () => {
  // Reset assessment id sequence for smart random to be predictable
  await setAssessmentIdSequence(1000);
  const competenceDTOs = await knex('learningcontent.competences')
    .jsonExtract('name_i18n', '$.fr', 'competenceTitle')
    .where('origin', 'Pix')
    .orderBy('index');
  COMPETENCE_TITLES = competenceDTOs.map(({ competenceTitle }: { competenceTitle: string }) => competenceTitle);
});

test('[@snapshot][@runSerially] user plays a campaign', async ({
  page: pixAppPage,
  pixOrgaMemberContext,
  testMode,
  globalTestId,
}: {
  page: Page;
  pixOrgaMemberContext: BrowserContext;
  testMode: TEST_MODE;
  globalTestId: string;
}, testInfo) => {
  testInfo.annotations.push(
    {
      type: 'tag',
      description: `@snapshot - this test runs against a reference snapshot. Snapshot can be generated with TEST_MODE=record env.
         Reasons why a snapshot can be re-generated :
         - AssessmentIdSequence has changed
         - Reference Release has changed
         - Next challenge algorithm for campaign evaluation has changed`,
    },
    {
      type: 'tag',
      description:
        '@runSerially - must run serially because this test fixes the assessment ID sequence to make sure to play on specific assessment ID',
    },
  );
  test.setTimeout(180_000);

  const results = {
    challengeImprints: [] as string[],
    masteryPercentages: [] as (string | undefined)[],
  };
  const pixOrgaPage = await pixOrgaMemberContext.newPage();
  await pixOrgaPage.goto(process.env.PIX_ORGA_URL as string);
  let campaignCode: string | null;
  await test.step('creates the campaign', async () => {
    await pixOrgaPage.getByRole('link', { name: 'Créer une campagne' }).click();
    const createCampaignPage = new PixOrgaPage(pixOrgaPage);
    await createCampaignPage.createEvaluationCampaign({
      campaignName: 'test playwright',
      targetProfileName: 'PC pour Playwright',
    });
    campaignCode = await pixOrgaPage.locator('dd.campaign-header-title__campaign-code > span').textContent();
  });

  await pixAppPage.goto(process.env.PIX_APP_URL as string);
  const loginPage = new LoginPage(pixAppPage);
  await loginPage.signup('Buffy', 'Summers', `buffy.summers.${globalTestId}@example.net`, 'Coucoulesdevs66');
  const rightWrongAnswerCycleIter = rightWrongAnswerCycle({ numRight: 1, numWrong: 1 });
  await test.step('plays the campaign', async () => {
    await pixAppPage.getByRole('link', { name: "J'ai un code" }).click();
    const startCampaignPage = new StartCampaignPage(pixAppPage);
    await startCampaignPage.goToFirstChallenge(campaignCode as string);
    await test.step(` answering right or wrong according to pattern`, async () => {
      while (!pixAppPage.url().endsWith('/checkpoint?finalCheckpoint=true')) {
        const challengePage = new ChallengePage(pixAppPage);
        const challengeImprint = await challengePage.getChallengeImprint();
        results.challengeImprints.push(challengeImprint);
        await challengePage.setRightOrWrongAnswer(rightWrongAnswerCycleIter.next().value as boolean);
        await challengePage.validateAnswer();

        if (pixAppPage.url().includes('/checkpoint') && !pixAppPage.url().includes('finalCheckpoint=true')) {
          const checkpointPage = new IntermediateCheckpointPage(pixAppPage);
          await checkpointPage.goNext();
        }
      }
    });

    await test.step(`campaign results`, async () => {
      const finalCheckpointPage = new FinalCheckpointPage(pixAppPage);
      await finalCheckpointPage.goToResults();

      const campaignResultsPage = new CampaignResultsPage(pixAppPage);
      const globalMasteryPercentage = await campaignResultsPage.getGlobalMasteryPercentage();
      results.masteryPercentages.push(globalMasteryPercentage);
      for (const competenceTitle of COMPETENCE_TITLES) {
        const masteryPercentage = await campaignResultsPage.getMasteryPercentageForCompetence(competenceTitle);
        results.masteryPercentages.push(masteryPercentage);
      }

      await campaignResultsPage.sendResults();
      await expect(pixAppPage.getByText('Vos résultats ont été envoyés')).toBeVisible();
    });
  });
  expectOrRecordResults({ results, resultFileName: 'campaign-evaluation.json', testMode });
});
