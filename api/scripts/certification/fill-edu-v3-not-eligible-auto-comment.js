import { knex } from '../../db/knex-database-connection.js';
import { AutoJuryCommentKeys } from '../../src/certification/shared/domain/models/JuryComment.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { AssessmentResult } from '../../src/shared/domain/models/AssessmentResult.js';

export class FillEduV3NotEligibleAutoComment extends Script {
  constructor() {
    super({
      description: 'Retro-fill the "commentByAutoJury" column for rejected Pix+Edu v3 in "assessment-results" table',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: true,
        },
        versions: {
          type: 'string',
          describe: 'Comma-separated list of complementary certification version IDs to target',
          demandOption: true,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun, versions } = options;
    const eduV3Versions = versions.split(',').map(Number);
    logger.info(`Script execution started with versions: ${eduV3Versions}`);

    const trx = await knex.transaction();
    try {
      const assessmentResultsToBeFilled = await trx('assessment-results')
        .pluck('id')
        .whereIn('versionId', eduV3Versions)
        .where({
          status: AssessmentResult.status.REJECTED,
          reachedMeshIndex: null,
          commentByAutoJury: null,
        });

      logger.info(`Number of Edu v3 assessment-results to be filled: ${assessmentResultsToBeFilled.length}`);

      await trx('assessment-results').whereIn('id', assessmentResultsToBeFilled).update({
        commentByAutoJury: AutoJuryCommentKeys.REJECTED_EDU_NOT_ELIGIBLE,
      });

      if (dryRun) {
        await trx.rollback();
        logger.info(`${assessmentResultsToBeFilled.length} would have been updated`);
        return;
      }

      await trx.commit();
      logger.info(`${assessmentResultsToBeFilled.length} have been successfully updated`);
      return;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, FillEduV3NotEligibleAutoComment);
