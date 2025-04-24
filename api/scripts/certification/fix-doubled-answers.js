import 'dotenv/config';

import Joi from 'joi';

import { knex } from '../../db/knex-database-connection.js';
import { csvFileParser } from '../../src/shared/application/scripts/parsers.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { Assessment } from '../../src/shared/domain/models/index.js';

const columnsSchemas = [
  { name: 'certificationChallengeId', schema: Joi.number() },
  { name: 'answerId', schema: Joi.number() },
  { name: 'completionDate', schema: Joi.string() },
];

export class FixDoubledAnswers extends Script {
  constructor() {
    super({
      description: 'Fix doubled answers in certification',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe:
            'CSV File with three columns with certificationChallengeIds (integer), answerIds (integer) and completion date (string) to process',
          demandOption: true,
          coerce: csvFileParser(columnsSchemas),
        },
        assessmentId: {
          type: 'integer',
          describe: 'Id of the assessment answers should be linked to',
          demandOption: true,
        },
        dryRun: {
          type: 'boolean',
          describe: 'Commit the UPDATE or not',
          demandOption: false,
          default: true,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { file: certifChallengeAndAnswerIds, assessmentId, dryRun } = options;
    this.logger = logger;

    this.logger.info(`dryRun=${dryRun}`);

    for (const line of certifChallengeAndAnswerIds) {
      const transaction = await knex.transaction();

      const { certificationChallengeId, answerId, completionDate } = line;
      try {
        // Retrieving the certification-course for upcoming update
        const certificationChallenge = await transaction('certification-challenges')
          .where({
            id: certificationChallengeId,
          })
          .first();
        const certificationCourse = await transaction('certification-courses')
          .where({
            id: certificationChallenge.courseId,
          })
          .first();

        // Update of the certification-course
        await transaction('certification-courses').where({ id: certificationCourse.id }).update({
          abortReason: null,
          completedAt: completionDate,
          endedAt: null,
          updatedAt: completionDate,
        });

        // Retrieving the assessment for upcoming update
        const assessment = await transaction('assessments')
          .where({ certificationCourseId: certificationCourse.id })
          .first();

        // Removing the certification-challenge-capacity that is not supposed to exist
        await transaction('certification-challenge-capacities').where({ certificationChallengeId, answerId }).delete();
        this.logger.info(
          `certification-challenge-capacity with certificationChallengeId:${certificationChallengeId} deleted`,
        );

        // Removing the certification-challenge that is not supposed to exist
        await transaction('certification-challenges').where('id', '=', certificationChallengeId).delete();
        this.logger.info(`certification-challenge: ${certificationChallengeId} deleted`);

        // assessment update
        const newLastCertificationChallenge = await transaction('certification-challenges')
          .where({
            courseId: certificationCourse.id,
          })
          .orderBy('id', 'desc')
          .first();

        await transaction('assessments').where({ id: assessment.id }).update({
          state: Assessment.states.COMPLETED,
          lastChallengeId: newLastCertificationChallenge.challengeId,
          updatedAt: completionDate,
          lastQuestionDate: completionDate,
        });

        // Link the answer that is not supposed to exist to an assessment created for this purpose
        await transaction('answers').where('id', '=', answerId).update({
          assessmentId,
        });
        this.logger.info(`answer: ${answerId} moved to assessment ${assessmentId}`);

        dryRun ? await transaction.rollback() : await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    return 0;
  }
}

await ScriptRunner.execute(import.meta.url, FixDoubledAnswers);
