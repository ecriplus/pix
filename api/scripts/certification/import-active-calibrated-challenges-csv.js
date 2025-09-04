import Joi from 'joi';

import { knex } from '../../db/knex-database-connection.js';
import { csvFileParser } from '../../src/shared/application/scripts/parsers.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const columnSchemas = [
  { name: 'challenge_id', schema: Joi.string() },
  { name: 'delta', schema: Joi.number() },
  { name: 'alpha', schema: Joi.number() },
];

export class ImportActiveCalibratedChallengesCsv extends Script {
  constructor() {
    super({
      description: 'Import calibrations from csv',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe:
            'CSV File with `challenge_id`, `alpha` and `delta` columns extracted from `datawarehouse.data_active_calibrated_challenges`',
          demandOption: true,
          coerce: csvFileParser(columnSchemas),
        },
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: false,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { file: calibratedChallengesFromDatawarehouse, dryRun } = options;
    logger.debug(calibratedChallengesFromDatawarehouse);
    const calibratedChallengesToInsert = [];

    for (const calibratedChallenge of calibratedChallengesFromDatawarehouse) {
      calibratedChallengesToInsert.push({
        challengeId: calibratedChallenge.challenge_id,
        delta: calibratedChallenge.delta,
        alpha: calibratedChallenge.alpha,
      });
    }

    const trx = await knex.transaction();
    try {
      const result = await trx.batchInsert(
        'certification-data-active-calibrated-challenges',
        calibratedChallengesToInsert,
      );

      if (dryRun) {
        await trx.rollback();
        logger.info(`Dry run: ${calibratedChallengesToInsert.length} challenges would be inserted`);
        return { processed: calibratedChallengesToInsert.length, inserted: 0 };
      }

      await trx.commit();
      logger.info(`Inserted ${calibratedChallengesToInsert.length} calibrated challenges`);
      return result;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, ImportActiveCalibratedChallengesCsv);
