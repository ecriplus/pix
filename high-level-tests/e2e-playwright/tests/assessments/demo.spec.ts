import { knex } from '../../helpers/db.ts';
import { test } from '../../helpers/fixtures.ts';
import { rightWrongAnswerCycle } from '../../helpers/utils.ts';
import { ChallengePage } from '../../pages/pix-app/index.ts';

let DEMO_COURSE_ID: string | null = null;

test.beforeEach(async () => {
  const courseDTOs = await knex('learningcontent.courses').select('*').where({ isActive: true }).orderBy('id', 'asc');
  for (const courseDTO of courseDTOs) {
    const challengeDTOs = await knex('learningcontent.challenges')
      .select('*')
      .whereIn('id', courseDTO.challenges)
      .where(
        (queryBuilder: {
          whereRaw: (arg0: string, arg1: string[]) => void;
          orWhereRaw: (arg0: string, arg1: string[]) => void;
        }) => {
          queryBuilder.whereRaw('? = ANY(learningcontent.challenges.locales)', ['fr']);
          queryBuilder.orWhereRaw('? = ANY(learningcontent.challenges.locales)', ['fr-fr']);
        },
      );
    if (challengeDTOs.length === courseDTO.challenges.length) {
      DEMO_COURSE_ID = courseDTO.id;
      break;
    }
  }
  if (!DEMO_COURSE_ID) {
    throw new Error('No suitable DEMO course found for this test');
  }
});

test(
  'user assesses on course demo',
  {
    tag: ['@snapshot'],
    annotation: [
      {
        type: 'tag',
        description: `@snapshot - this test runs against a reference snapshot. Snapshot can be generated with UPDATE_SNAPSHOTS=true
         Reasons why a snapshot can be re-generated :
         - Reference Release has changed
         - Next challenge algorithm for demo has changed`,
      },
    ],
  },
  async ({ page, snapshotHandler }) => {
    const rightWrongAnswerCycleIter = rightWrongAnswerCycle({ numRight: 1, numWrong: 1 });
    await test.step(`DEMO assessment started`, async () => {
      await page.goto(process.env.PIX_APP_URL + '/courses/' + DEMO_COURSE_ID);
      await test.step(` answering right or wrong according to pattern`, async () => {
        while (!page.url().endsWith('results')) {
          const challengePage = new ChallengePage(page);
          const challengeImprint = await challengePage.getChallengeImprint();
          snapshotHandler.push('challenge imprint to have value', challengeImprint);

          await challengePage.setRightOrWrongAnswer(rightWrongAnswerCycleIter.next().value as boolean);
          await challengePage.validateAnswer();
        }
      });
    });

    await snapshotHandler.expectOrRecord('demo.json');
  },
);
