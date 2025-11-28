import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const OLD_DOMAIN = 'images.pix.fr';
const NEW_DOMAIN = 'assets.pix.org';
const REGEX_FOR_DUPLICATE_PROTOCOL = /https:\/\/[^/]+\/.*?(https:\/\/[^"]+)$/;

export class ModifyBadgeAndTrainingLogoUrlsDomain extends Script {
  constructor() {
    super({
      description: "Change the domain of training's logo and badge URLs for Pix Assets",
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
      const trainingsToBeUpdated = await trx('trainings').whereLike('editorLogoUrl', `%${OLD_DOMAIN}%`);
      logger.info(`Number of trainings with a editorLogoUrl containing the old domain: ${trainingsToBeUpdated.length}`);

      const badgesToBeUpdated = await trx('badges').whereLike('imageUrl', `%${OLD_DOMAIN}%`);
      logger.info(`Number of badges with a imageUrl containing the old domain: ${badgesToBeUpdated.length}`);

      for (const training of trainingsToBeUpdated) {
        training.editorLogoUrl = modifyUrlWithNewDomain(training.editorLogoUrl);
        await trx('trainings')
          .update({ editorLogoUrl: training.editorLogoUrl, updatedAt: new Date() })
          .where({ id: training.id });
      }

      for (const badge of badgesToBeUpdated) {
        badge.imageUrl = modifyUrlWithNewDomain(badge.imageUrl);
        await trx('badges').update({ imageUrl: badge.imageUrl }).where({ id: badge.id });
      }

      if (dryRun) {
        const trainings = await trx('trainings').select('editorLogoUrl').whereLike('editorLogoUrl', `%${OLD_DOMAIN}%`);
        const trainingsUrlUpdated = trainings.map((item) => item.editorLogoUrl);

        const badges = await trx('badges').select('imageUrl').whereLike('imageUrl', `%${OLD_DOMAIN}%`);
        const badgesUrlUpdated = badges.map((item) => item.imageUrl);

        logger.info(`Trainings list with old domain after update : ${trainingsUrlUpdated}`);
        logger.info(`Badges list with old domain after update : ${badgesUrlUpdated}`);

        await trx.rollback();
        return;
      }

      await trx.commit();
      logger.info(`${trainingsToBeUpdated.length} trainings have been successfully updated`);
      logger.info(`${badgesToBeUpdated.length} badges have been successfully updated`);
      return;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

function modifyUrlWithNewDomain(url) {
  const invalidUrlWithDuplicateProtocol = url.match(REGEX_FOR_DUPLICATE_PROTOCOL);
  if (invalidUrlWithDuplicateProtocol) {
    url = invalidUrlWithDuplicateProtocol[1];
  }
  return url.replace(`https://${OLD_DOMAIN}`, `https://${NEW_DOMAIN}`);
}

await ScriptRunner.execute(import.meta.url, ModifyBadgeAndTrainingLogoUrlsDomain);
