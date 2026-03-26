import CertificationRescored from '../../src/certification/evaluation/domain/events/CertificationRescored.js';
import { usecases } from '../../src/certification/evaluation/domain/usecases/index.js';
import { commaSeparatedNumberParser } from '../../src/shared/application/scripts/parsers.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';

export class RescoreV3Certifications extends Script {
  constructor() {
    super({
      description:
        'It can be tedious for team certif métier to re-score some certifications (because code/algo/scoring changes). This script can rescore all the certifications given in the list',
      permanent: true,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
        ids: {
          type: 'string',
          describe: "Liste d'IDs de certification séparés par des virgules. Ex: 1,2,3,4",
          coerce: commaSeparatedNumberParser(),
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun, ids } = options;
    logger.info('Script execution started');
    for (const certificationCourseId of ids) {
      try {
        await DomainTransaction.execute(async () => {
          const event = new CertificationRescored({ certificationCourseId });
          await usecases.scoreV3Certification({ event, certificationCourseId });
          if (dryRun) {
            throw new Error('dryRun');
          }
        });
      } catch (err) {
        if (err.message !== 'dryRun') {
          logger.error({ err }, `Error encountered while rescoring certification ${certificationCourseId}`);
        }
      }
    }

    logger.info('No more certifications to process youpi');
  }
}

await ScriptRunner.execute(import.meta.url, RescoreV3Certifications);
