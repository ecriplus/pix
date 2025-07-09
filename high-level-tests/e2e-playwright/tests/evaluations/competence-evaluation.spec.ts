import path from 'node:path';

import { Page } from '@playwright/test';
import * as fs from 'fs/promises';

import { knex, setAssessmentIdSequence } from '../../helpers/db.js';
import { expect, test } from '../../helpers/fixtures.ts';
import { rightWrongAnswerCycle } from '../../helpers/utils.ts';
import {
  ChallengePage,
  CompetenceResultPage,
  FinalCheckpointPage,
  IntermediateCheckpointPage,
  LoginPage,
} from '../../pages/pix-app/index.ts';

const RESULT_DIR = path.resolve(import.meta.dirname, './data');
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

test('user assessing on 5 Pix Competences', async ({
  page,
  testMode,
}: {
  page: Page;
  testMode: string;
}, testInfo) => {
  test.setTimeout(120_000);
  let results;
  const resultFilePath = path.join(RESULT_DIR, 'competence-evaluation.json');
  if (testMode === 'record') {
    results = {
      challengeImprints: [],
      levels: [],
      pixScores: [],
    };
  } else {
    results = await fs.readFile(resultFilePath, 'utf-8');
    results = JSON.parse(results);
  }

  const rightWrongAnswerCycleIter = rightWrongAnswerCycle({ numRight: 1, numWrong: 2 });
  await page.goto(process.env.PIX_APP_URL as string);
  const loginPage = new LoginPage(page);
  await loginPage.signup('Buffy', 'Summers', `buffy.summers.${testInfo.testId}@example.net`, 'Coucoulesdevs66');
  await page.getByRole('link', { name: 'Compétences', exact: true }).click();
  let globalChallengeIndex = 0;
  let competenceIndex = 0;
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

      let challengeIndexInCompetence = 0;
      await test.step(`"${competenceTitle}" answering right or wrong according to pattern`, async () => {
        while (!page.url().endsWith('/checkpoint?finalCheckpoint=true')) {
          const challengePage = new ChallengePage(page);
          const challengeImprint = await challengePage.getChallengeImprint();
          if (testMode === 'record') {
            results.challengeImprints.push(challengeImprint);
          } else {
            expect(challengeImprint).toBe(results.challengeImprints[globalChallengeIndex]);
            await expect(page.getByLabel('Votre progression')).toContainText(
              `Question ${(challengeIndexInCompetence % 5) + 1} / 5`,
            );
          }
          ++globalChallengeIndex;
          ++challengeIndexInCompetence;
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
        if (testMode === 'record') {
          results.levels.push(level);
          results.pixScores.push(pixScore);
        } else {
          expect(level).toBe(results.levels[competenceIndex]);
          expect(pixScore).toBe(results.pixScores[competenceIndex]);
        }
        await competenceResultPage.goBackToCompetences();
      });
    });
    ++competenceIndex;
  }
  if (testMode === 'record') {
    await fs.writeFile(resultFilePath, JSON.stringify(results));
  }
});
