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

export class CreateCertificationFrameworksChallengesFromCsv extends Script {
  constructor() {
    super({
      description: 'Create certification frameworks challenges from csv',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe:
            'CSV File with `challenge_id`, `alpha` (discriminant) and `delta` (difficulty) columns extracted from `datawarehouse.data_calibrated_challenges`',
          demandOption: true,
          coerce: csvFileParser(columnSchemas),
        },
        scope: {
          type: 'string',
          describe: 'Scope of the certification framework. Null = default framework = CORE',
          demandOption: false,
          requiresArg: false,
        },
        version: {
          type: 'string',
          describe: 'Version of the certification framework (YYYYMMDDHHMMSS)',
          demandOption: true,
          requiresArg: true,
        },
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { file: calibratedChallengesFromDatawarehouse, scope, version, dryRun } = options;
    logger.debug(calibratedChallengesFromDatawarehouse);
    const calibratedChallengesToInsert = [];

    for (const calibratedChallenge of calibratedChallengesFromDatawarehouse) {
      calibratedChallengesToInsert.push({
        challengeId: calibratedChallenge.challenge_id,
        difficulty: calibratedChallenge.delta,
        discriminant: calibratedChallenge.alpha,
        complementaryCertificationKey: scope,
        version,
      });
    }

    const trx = await knex.transaction();
    try {
      const result = await trx.batchInsert('certification-frameworks-challenges', calibratedChallengesToInsert);

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

await ScriptRunner.execute(import.meta.url, CreateCertificationFrameworksChallengesFromCsv);
