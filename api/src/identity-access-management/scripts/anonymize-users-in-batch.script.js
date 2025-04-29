import joi from 'joi';

import { csvFileParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { usecases } from '../domain/usecases/index.js';

const columnsSchema = [{ name: 'userId', schema: joi.number().required() }];

export class AnonymizeUsersInBatchScript extends Script {
  constructor() {
    super({
      description: 'Anonymizes the given user accounts.',
      permanent: true,
      options: {
        file: {
          type: 'string',
          describe: 'The file path',
          demandOption: true,
          coerce: csvFileParser(columnsSchema),
        },
        dryRun: {
          type: 'boolean',
          describe: 'If present, the script will not make any changes to the database',
          default: false,
        },
        anonymizerId: {
          type: 'number',
          describe: 'The user id of the anonymizer',
          demandOption: true,
        },
      },
    });

    this.successLines = 0;
    this.failedLines = 0;
    this.totalLines = 0;
    this.errorOccured = false;
  }

  async handle({ options, logger, anonymizeUser = usecases.anonymizeUser }) {
    const { file, dryRun, anonymizerId } = options;
    if (dryRun) {
      logger.info(`DryRun mode, ${file.length} user accounts to be processed.`);
      return;
    }

    this.totalLines = file.length;
    for (const [index, { userId }] of file.entries()) {
      try {
        await anonymizeUser({
          userId,
          updatedByUserId: anonymizerId,
        });
        this.successLines++;
      } catch (error) {
        this.errorOccured = true;
        this.failedLines++;
        logger.error(`Error on line ${index + 1}. ${error}`);
      }
    }

    logger.info(`${this.successLines} user accounts processed successfully.`);

    if (this.errorOccured) {
      throw new Error('There was some errors during the process.');
    }
  }
}

await ScriptRunner.execute(import.meta.url, AnonymizeUsersInBatchScript);
