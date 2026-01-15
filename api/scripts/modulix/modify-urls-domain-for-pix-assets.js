import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const OLD_DOMAIN = 'images.pix.fr';
const NEW_DOMAIN = 'assets.pix.org';

export class ModifyComplementaryCertificationBadgeUrlsDomain extends Script {
  constructor() {
    super({
      description: 'Change the domain of complementary certification badge URLs for Pix Assets',
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
      const complementaryCertificationBadgesToBeUpdated = await trx('complementary-certification-badges').whereLike(
        'imageUrl',
        `%${OLD_DOMAIN}%`,
      );
      logger.info(
        `Number of complementary certification badges with a imageUrl containing the old domain: ${complementaryCertificationBadgesToBeUpdated.length}`,
      );

      for (const complementaryCertificationBadge of complementaryCertificationBadgesToBeUpdated) {
        complementaryCertificationBadge.imageUrl = modifyUrlWithNewDomain(complementaryCertificationBadge.imageUrl);
        await trx('complementary-certification-badges')
          .update({ imageUrl: complementaryCertificationBadge.imageUrl })
          .where({ id: complementaryCertificationBadge.id });
      }

      if (dryRun) {
        const complementaryCertificationBadges = await trx('complementary-certification-badges')
          .select('imageUrl')
          .whereLike('imageUrl', `%${OLD_DOMAIN}%`);
        const complementaryCertificationBadgesUrlUpdated = complementaryCertificationBadges.map(
          (item) => item.imageUrl,
        );

        logger.info(
          `Complementary certification badges list with old domain after update : ${complementaryCertificationBadgesUrlUpdated}`,
        );

        await trx.rollback();
        return;
      }

      await trx.commit();
      logger.info(
        `${complementaryCertificationBadgesToBeUpdated.length} complementary certification badges have been successfully updated`,
      );
      return;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

function modifyUrlWithNewDomain(url) {
  return url.replace(`https://${OLD_DOMAIN}`, `https://${NEW_DOMAIN}`);
}

await ScriptRunner.execute(import.meta.url, ModifyComplementaryCertificationBadgeUrlsDomain);
