import Joi from 'joi';

import { csvFileParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { usecases } from '../domain/usecases/index.js';

export const csvSchemas = [
  { name: 'userId', schema: Joi.number().required() },
  { name: 'last_activity', schema: Joi.date().required() },
];

export class ImportUserLastLogeedAtScript extends Script {
  constructor() {
    super({
      description: 'This script allows to update user last logged at',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe: 'CSV file path',
          demandOption: true,
          coerce: csvFileParser(csvSchemas),
        },
        dryRun: {
          type: 'boolean',
          describe: 'Executes the script in dry run mode',
          default: false,
        },
      },
    });
  }
  async handle({ options, logger, importUserLastLoggedAt = usecases.importUserLastLoggedAt }) {
    const { file, dryRun } = options;

    const total = file.length;

    if (dryRun) logger.info('DRY RUN mode enabled - data updates are not effective');

    logger.info(`${total} users must be processed for last logged date update.`);
    let count = 0;
    let updatedCount = 0;
    let notUpdatedCount = 0;

    for (const row of file) {
      const { userId, last_activity } = row;
      count += 1;
      const result = await importUserLastLoggedAt({ dryRun, userId, lastActivity: last_activity });
      if (result) {
        logger.info(`${count}/${total} - user updated`);
        updatedCount += 1;
      } else {
        logger.info(`${count}/${total} - user not updated`);
        notUpdatedCount += 1;
      }
    }

    logger.info(`${count} users processed.`);
    logger.info(`${updatedCount} users with last logged at updated.`);
    logger.info(`${notUpdatedCount} users with last logged at NOT updated.`);
  }
}

await ScriptRunner.execute(import.meta.url, ImportUserLastLogeedAtScript);
