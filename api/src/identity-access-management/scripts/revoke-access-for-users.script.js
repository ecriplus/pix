import { setTimeout } from 'node:timers/promises';

import Joi from 'joi';
import _ from 'lodash';

import { csvFileParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { usecases } from '../domain/usecases/index.js';

export const csvSchema = [{ name: 'userId', schema: Joi.number().required() }];

const DEFAULT_BATCH_SIZE = 100;
const DEFAULT_THROTTLE_DELAY = 300;

export class RevokeAccessForUsersScript extends Script {
  constructor() {
    super({
      description: 'Revoke access to users by revoking Access token, Refresh Token and resetting password.',
      permanent: true,
      options: {
        file: {
          type: 'string',
          describe: 'CSV file path',
          demandOption: true,
          requiresArg: true,
          coerce: csvFileParser(csvSchema),
        },
        batchSize: {
          type: 'number',
          describe: 'Size of the batch of users to process',
          default: DEFAULT_BATCH_SIZE,
        },
        throttleDelay: {
          type: 'number',
          describe: 'Delay between batches in milliseconds',
          default: DEFAULT_THROTTLE_DELAY,
        },
        dryRun: {
          type: 'boolean',
          describe: 'Executes the script in dry run mode',
          default: false,
        },
      },
    });
  }
  async handle({ options, logger, revokeAccessForUsers = usecases.revokeAccessForUsers }) {
    const { file, batchSize, throttleDelay, dryRun } = options;

    const batches = _.chunk(file, batchSize);

    let batchCount = 1;
    for (const batch of batches) {
      logger.info(`Batch #${batchCount++}`);

      const userIds = batch.map((row) => row.userId);

      if (!dryRun) {
        await revokeAccessForUsers({ userIds });
      }

      await setTimeout(throttleDelay);
    }

    if (dryRun) {
      logger.info(`${file.length} users access to be revoked.`);
    } else {
      logger.info(`${file.length} users access revoked.`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, RevokeAccessForUsersScript);
