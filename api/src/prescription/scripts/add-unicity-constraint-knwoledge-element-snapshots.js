import { knex } from '../../../db/knex-database-connection.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';

class AddUnicityConstraintKnowledgeElementSnapshots extends Script {
  constructor() {
    super({
      description: 'Script to add campaignParticipationId unicity constraint on knowledge-element-snapshots',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'execute script without commit',
          demandOption: false,
          default: true,
        },
      },
    });
  }

  async handle({ options, logger }) {
    logger.info(`add-unicity-constraint-knowledge-element-snapshots | START`);
    logger.info(`add-unicity-constraint-knowledge-element-snapshots | dryRun ${options.dryRun}`);

    const trx = await knex.transaction();
    try {
      await trx.schema.table('knowledge-element-snapshots', function (table) {
        table.unique('campaignParticipationId', {
          indexName: 'one_snapshot_by_campaignParticipationId',
        });
      });

      if (options.dryRun) {
        logger.info(`add-unicity-constraint-knowledge-element-snapshots | rollback`);
        await trx.rollback();
      } else {
        logger.info(`add-unicity-constraint-knowledge-element-snapshots | commit`);
        await trx.commit();
      }
    } catch (err) {
      logger.error(`add-unicity-constraint-knowledge-element-snapshots | FAIL | Reason : ${err}`);
      await trx.rollback();
    } finally {
      logger.info(`add-unicity-constraint-knowledge-element-snapshots | END`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, AddUnicityConstraintKnowledgeElementSnapshots);

export { AddUnicityConstraintKnowledgeElementSnapshots };
