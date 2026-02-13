import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const OLD_TYPE_LABEL = 'QAB_CARD_RETRIED';
const NEW_LABEL_TYPE = 'QAB_RETRIED';

export class ModifyTypeLabelPassageEventQabCardRetried extends Script {
  constructor() {
    super({
      description: 'Rename type label of passage events recorded when a QAB has been retried',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run the script without making any database changes',
          default: false,
        },
      },
    });
  }

  async handle({ logger, options }) {
    const { dryRun } = options;
    logger.info('Script execution started');

    const trx = await knex.transaction();
    try {
      const passageEventsTypeLabelToBeUpdated = await trx('passage-events').where('type', `${OLD_TYPE_LABEL}`);
      logger.info(
        `Number of passage event with the old type QAB_CARD_RETRIED : ${passageEventsTypeLabelToBeUpdated.length}`,
      );

      for (const passageEvent of passageEventsTypeLabelToBeUpdated) {
        await trx('passage-events').update({ type: NEW_LABEL_TYPE }).where({ id: passageEvent.id });
      }

      if (dryRun) {
        const passageEventsTypeLabel = await trx('passage-events').select('type').where('type', `${OLD_TYPE_LABEL}`);
        const passageEventsTypeLabelUpdated = passageEventsTypeLabel.map((item) => item.type);

        logger.info(
          `List of passage events with old type label ‘QAB_CARD_RETRIED‘ left after update : ${passageEventsTypeLabelUpdated}`,
        );

        await trx.rollback();
        return;
      }

      await trx.commit();
      logger.info(`${passageEventsTypeLabelToBeUpdated.length} passage events have been successfully updated.`);
      return;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, ModifyTypeLabelPassageEventQabCardRetried);
