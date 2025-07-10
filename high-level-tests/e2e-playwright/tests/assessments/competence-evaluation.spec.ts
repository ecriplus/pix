import { Page } from '@playwright/test';

import { knex, setAssessmentIdSequence } from '../../helpers/db.js';
import { expectOrRecordResults, test, TEST_MODE } from '../../helpers/fixtures.ts';
import { rightWrongAnswerCycle } from '../../helpers/utils.ts';
import {
  ChallengePage,
  CompetenceResultPage,
  FinalCheckpointPage,
  IntermediateCheckpointPage,
  LoginPage,
} from '../../pages/pix-app/index.ts';

let COMPETENCE_TITLES: string[];
test.beforeEach(async () => {
  const competenceDTOs = await knex('learningcontent.competences')
    .jsonExtract('name_i18n', '$.fr', 'competenceTitle')
    .where('origin', 'Pix')
    .orderBy('index');
  COMPETENCE_TITLES = competenceDTOs.map(({ competenceTitle }: { competenceTitle: string }) => competenceTitle);
  // Reset assessment id sequence for smart random to be predictable
  await setAssessmentIdSequence(3000);
});

test('[@snapshot][@runSerially] user assessing on 5 Pix Competences', async ({
  page,
  testMode,
  globalTestId,
}: {
  page: Page;
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
         - Next challenge algorithm for competence evaluation has changed`,
    },
    {
      type: 'tag',
      description:
        '@runSerially - must run serially because this test fixes the assessment ID sequence to make sure to play on specific assessment ID',
    },
  );
  test.setTimeout(120_000);

  const results = {
    challengeImprints: [] as string[],
    levels: [] as (string | undefined)[],
    pixScores: [] as (string | undefined)[],
  };

  const rightWrongAnswerCycleIter = rightWrongAnswerCycle({ numRight: 1, numWrong: 2 });
  await page.goto(process.env.PIX_APP_URL as string);
  const loginPage = new LoginPage(page);
  await loginPage.signup('Buffy', 'Summers', `buffy.summers.${globalTestId}@example.net`, 'Coucoulesdevs66');
  await page.getByRole('link', { name: 'Compétences', exact: true }).click();
  for (const competenceTitle of [
    COMPETENCE_TITLES[3],
    COMPETENCE_TITLES[12],
    COMPETENCE_TITLES[7],
    COMPETENCE_TITLES[5],
    COMPETENCE_TITLES[6],
  ]) {
    await test.step(`"${competenceTitle}" assessment started`, async () => {
      await page.getByRole('link', { name: competenceTitle }).first().click();
      await page.getByRole('link', { name: 'Commencer' }).click();

      await test.step(`"${competenceTitle}" answering right or wrong according to pattern`, async () => {
        while (!page.url().endsWith('/checkpoint?finalCheckpoint=true')) {
          const challengePage = new ChallengePage(page);
          const challengeImprint = await challengePage.getChallengeImprint();
          results.challengeImprints.push(challengeImprint);
          await challengePage.setRightOrWrongAnswer(rightWrongAnswerCycleIter.next().value as boolean);
          await challengePage.validateAnswer();

          if (page.url().includes('/checkpoint') && !page.url().includes('finalCheckpoint=true')) {
            const checkpointPage = new IntermediateCheckpointPage(page);
            await checkpointPage.goNext();
          }
        }
      });

      await test.step(`"${competenceTitle}" assessment results`, async () => {
        const finalCheckpointPage = new FinalCheckpointPage(page);
        await finalCheckpointPage.goToResults();
        const competenceResultPage = new CompetenceResultPage(page);
        const level = await competenceResultPage.getLevel();
        const pixScore = await competenceResultPage.getPixScore();
        results.levels.push(level);
        results.pixScores.push(pixScore);
        await competenceResultPage.goBackToCompetences();
      });
    });
  }
  expectOrRecordResults({ results, resultFileName: 'competence-evaluation.json', testMode });
});
