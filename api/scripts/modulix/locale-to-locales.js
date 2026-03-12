import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class LocaleToLocalesScript extends Script {
  constructor() {
    super({
      description: 'Copy the "locale" column value into the "locales" array column for each training',
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
      const trainings = await trx('trainings').select('id', 'locale');
      logger.info(`Found ${trainings.length} trainings to update`);

      for (const training of trainings) {
        await trx('trainings')
          .where('id', training.id)
          .update({ locales: [training.locale] });
      }

      if (dryRun) {
        await trx.rollback();
        logger.info(`Dry run: ${trainings.length} trainings would have been updated`);
        return;
      }

      await trx.commit();
      logger.info(`${trainings.length} trainings have been successfully updated`);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, LocaleToLocalesScript);
