import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../../db/migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } from '../../../db/pgsql-errors.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../shared/domain/DomainTransaction.js';

const options = {
  limit: {
    type: 'number',
    describe: 'Id limit',
    demandOption: true,
    requiresArg: true,
    coerce: Number,
  },
  offset: {
    type: 'number',
    describe: 'Id offset',
    demandOption: true,
    requiresArg: true,
    coerce: Number,
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
    const profileRewards = await this.fetchProfileRewards(options.limit, options.offset);

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
   * @param {number} limit
   * @param {number} offset
   *
   * @returns {Promise<[{id:number, userId:number}]>}
   */
  async fetchProfileRewards(limit, offset) {
    const knexConnection = DomainTransaction.getConnection();
    return await knexConnection('profile-rewards').select('userId', 'id').limit(limit).offset(offset).orderBy('id');
  }

  async fetchUserOrganizations(userId) {
    const knexConnection = DomainTransaction.getConnection();
    const organizations = await knexConnection('view-active-organization-learners')
      .select('organizationId')
      .where({ userId });

    return organizations.map(({ organizationId }) => organizationId);
  }
}

await ScriptRunner.execute(import.meta.url, SixthGradeOrganizationShare);
