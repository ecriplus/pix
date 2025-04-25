import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../../db/migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } from '../../../db/pgsql-errors.js';
import { isoDateParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../shared/domain/DomainTransaction.js';

const options = {
  start: {
    type: 'string',
    describe: 'Date de début de la période à traiter, jour inclus, format "YYYY-MM-DD", (ex: "2024-01-20")',
    demandOption: false,
    requiresArg: true,
    coerce: isoDateParser(),
  },
  end: {
    type: 'string',
    describe: 'Date de fin de la période à traiter, jour inclus, format "YYYY-MM-DD", (ex: "2024-02-27")',
    demandOption: true,
    requiresArg: true,
    coerce: isoDateParser(),
  },
};

export class SixthGradeOrganizationShare extends Script {
  constructor() {
    super({
      description: 'Insert share attestations with organizations for sixth graders',
      permanent: false,
      options,
    });
  }

  async handle({ options, logger }) {
    this.checkEndDateBeforeStartDate(options.start, options.end);

    const profileRewards = await this.fetchProfileRewards(options.start, options.end);

    logger.info(`${profileRewards.length} users to handle`);

    let count = 1;

    for (const profileReward of profileRewards) {
      logger.info(`Handling user ${profileReward.userId}: (${count}/${profileRewards.length})`);

      const userOrganizationIds = await this.fetchUserOrganizations(profileReward.userId);

      logger.info(`Organization ids for user ${profileReward.userId}: ${userOrganizationIds.join(',')}`);

      for (const organizationId of userOrganizationIds) {
        const knexConnection = await DomainTransaction.getConnection();
        logger.info(`Table insertion for user ${profileReward.userId} and organization ${organizationId}`);

        try {
          await knexConnection(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME).insert({
            profileRewardId: profileReward.id,
            organizationId,
          });
        } catch (error) {
          if (error.code === PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR) {
            logger.warn(
              `User ${profileReward.userId} already shared an attestation with organization ${organizationId}`,
            );
          } else {
            throw error;
          }
        }
      }

      count++;
    }
  }

  /**
   * @param {Date} start
   * @param {Date} end
   *
   * @returns {Promise<[{id:number, userId:number}]>}
   */
  async fetchProfileRewards(start, end) {
    const knexConnection = DomainTransaction.getConnection();
    return await knexConnection('profile-rewards')
      .select('userId', 'id')
      .where('createdAt', '<=', end)
      .where('createdAt', '>=', start)
      .orderBy('id');
  }

  async fetchUserOrganizations(userId) {
    const knexConnection = DomainTransaction.getConnection();
    const organizations = await knexConnection('view-active-organization-learners')
      .select('organizationId')
      .where({ userId });

    return organizations.map(({ organizationId }) => organizationId);
  }

  /**
   * Check if the end date is before the start date.
   *
   * @param {Date} startDate
   * @param {Date} endDate
   */
  checkEndDateBeforeStartDate(startDate, endDate) {
    if (endDate < startDate) {
      throw new Error('The end date must be after than the start date');
    }
  }
}

await ScriptRunner.execute(import.meta.url, SixthGradeOrganizationShare);
