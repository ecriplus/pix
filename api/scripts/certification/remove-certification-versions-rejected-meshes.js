import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';

export class RemoveCertificationVersionsRejectedMeshes extends Script {
  constructor() {
    super({
      description:
        'Pix+ EDU certifications versions globalScoringConfiguration are filled with a rejected mesh. We want to remove those meshes.',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun } = options;
    logger.info('Script execution started');

    await DomainTransaction.execute(async () => {
      const trx = DomainTransaction.getConnection();

      try {
        await trx('certification_versions')
          .where('scope', 'like', `EDU_%`)
          .update({
            globalScoringConfiguration: JSON.stringify([{ bounds: { max: 8, min: 1 }, meshLevel: 0 }]),
          });

        if (dryRun) {
          await trx.rollback();
        } else {
          await trx.commit();
        }
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    });

    logger.info('Pix+ Edu certification versions globalScoringConfiguration are updated');
  }
}

await ScriptRunner.execute(import.meta.url, RemoveCertificationVersionsRejectedMeshes);
