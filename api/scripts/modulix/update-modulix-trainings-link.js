import { knex } from '../../db/knex-database-connection.js';
import moduleService from '../../src/devcomp/domain/services/module-service.js';
import { repositories } from '../../src/devcomp/infrastructure/repositories/index.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class UpdateModulixTrainingsLink extends Script {
  constructor() {
    super({
      description: 'Update Modulix training link and remove tmp from slug',
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
      const trainingsToBeUpdated = await trx('trainings').whereLike('link', `%/modules/%`).andWhere('type', 'modulix');

      for (const training of trainingsToBeUpdated) {
        const splittedLink = training.link.split('modules');
        const module = await moduleService.getModuleByLink({
          link: training.link,
          moduleRepository: repositories.moduleRepository,
        });
        const tmpSlug = splittedLink[1].split('tmp-');
        const newLink = `${splittedLink[0]}modules/${module.shortId}${tmpSlug.join('')}`;
        await trx('trainings').update({ link: newLink, updatedAt: new Date() }).where({ id: training.id });
      }

      if (dryRun) {
        const training = await trx('trainings').whereLike('link', `%/modules/%`).andWhere('type', 'modulix').first();

        logger.info(`Training link after update : ${training.link}`);
        await trx.rollback();

        logger.info(`${trainingsToBeUpdated.length} training(s) should have been updated`);
        return;
      }

      await trx.commit();
      logger.info(`${trainingsToBeUpdated.length} trainings have been successfully updated`);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, UpdateModulixTrainingsLink);
