import Joi from 'joi';

import { csvFileParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { usecases } from '../domain/usecases/index.js';

const columnsSchemas = [
  { name: 'certificationCenterId', schema: Joi.number().required() },
  { name: 'archivedBy', schema: Joi.number().required() },
];

export class ArchiveCertificationCentersScript extends Script {
  constructor() {
    super({
      description: 'Archive certification centers from a csv file',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe: 'The file path',
          demandOption: true,
          coerce: csvFileParser(columnsSchemas),
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, the script will not update the database',
          default: false,
        },
      },
    });
    this.totalLines = 0;
    this.successLines = 0;
    this.failedLines = 0;
    this.errorOccured = false;
  }

  async handle({ options, logger, archiveCertificationCenter = usecases.archiveCertificationCenter }) {
    const { file, dryRun } = options;
    if (!dryRun) {
      for (const [index, certificationCenter] of file.entries()) {
        this.totalLines++;
        try {
          await archiveCertificationCenter({
            certificationCenterId: certificationCenter.certificationCenterId,
            userId: certificationCenter.archivedBy,
          });
          this.successLines++;
        } catch (error) {
          this.failedLines++;
          this.errorOccured = true;
          logger.error(`Error on line ${index}. ${error}`);
        }
      }
      logger.info(`${this.successLines} of ${this.totalLines} certification centers archived`);
      if (this.errorOccured) {
        throw new Error(`There were ${this.failedLines} errors while archiving certification centers`);
      }
    } else {
      logger.info(`This is a dry run. No certification centers were archived but ${file.length} lines were processed`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, ArchiveCertificationCentersScript);
