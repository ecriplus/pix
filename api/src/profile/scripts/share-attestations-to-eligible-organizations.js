import * as organizationLearnerWithParticipationApi from '../../prescription/organization-learner/application/api/organization-learners-with-participations-api.js';
import { CampaignParticipationStatuses } from '../../prescription/shared/domain/constants.js';
import { DataForQuest } from '../../quest/domain/models/DataForQuest.js';
import { Eligibility } from '../../quest/domain/models/Eligibility.js';
import { repositories } from '../../quest/infrastructure/repositories/index.js';
import * as questRepository from '../../quest/infrastructure/repositories/quest-repository.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../shared/domain/DomainTransaction.js';
import * as organizationProfileRewardRepository from '../infrastructure/repositories/organizations-profile-reward-repository.js';

export class ShareAttestationsToEligibleOrganizationsScript extends Script {
  constructor() {
    super({
      description: 'Share learner attestations with eligible organizations',
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
    await DomainTransaction.execute(async () => {
      const knexConn = DomainTransaction.getConnection();
      logger.info(`BEGIN: ShareAttestationsToEligibleOrganizationsScript`);
      const profileRewards = await this.fetchProfileRewardNotShared();

      const quests = await questRepository.findAllWithReward();

      if (quests.length === 0) {
        return;
      }

      logger.info(`${profileRewards.length} profile reward to handle`);
      const eligibilitiesByUserId = {};

      for (const profileReward of profileRewards) {
        logger.info(
          `Parsing profileReward ${profileReward.id} on reward ${profileReward.rewardId} for user ${profileReward.userId}`,
        );

        const desiredQuest = quests.find((quest) => quest.rewardId === profileReward.rewardId);
        if (!desiredQuest) continue;

        if (!eligibilitiesByUserId[profileReward.userId]) {
          const eligibilities = await organizationLearnerWithParticipationApi.find({ userIds: [profileReward.userId] });

          eligibilitiesByUserId[profileReward.userId] = eligibilities.map(
            (organizationLearnersWithParticipations) => new Eligibility(organizationLearnersWithParticipations),
          );
        }

        const dataForQuests = eligibilitiesByUserId[profileReward.userId]
          .map((eligibility) => new DataForQuest({ eligibility }))
          .filter((dataForQuest) => desiredQuest.isEligible(dataForQuest));

        if (dataForQuests.length === 0) {
          continue;
        }

        for (const dataForQuest of dataForQuests) {
          logger.info(`Parsing dataForQuest of profileReward ${profileReward.id}`);

          const campaignParticipationIds = desiredQuest.findCampaignParticipationIdsContributingToQuest(dataForQuest);
          const targetProfileIds =
            desiredQuest.findTargetProfileIdsWithoutCampaignParticipationContributingToQuest(dataForQuest);
          const success = await repositories.successRepository.find({
            userId: profileReward.userId,
            campaignParticipationIds,
            targetProfileIds,
          });
          dataForQuest.success = success;
          const userHasSucceedQuest = desiredQuest.isSuccessful(dataForQuest);

          if (userHasSucceedQuest) {
            logger.info(`Quest success found for profileReward ${profileReward.id}`);

            const isParticipationShared = await knexConn('campaign-participations')
              .select('id')
              .where('status', CampaignParticipationStatuses.SHARED)
              .orderBy('createdAt', 'DESC')
              .whereIn('id', campaignParticipationIds)
              .first();

            if (isParticipationShared) {
              logger.info(
                `Inserting organizationProfileReward for ${profileReward.id} on organization ${dataForQuest.organization.id}`,
              );
              await organizationProfileRewardRepository.save({
                organizationId: dataForQuest.organization.id,
                profileRewardId: profileReward.id,
              });
            }
          }
        }
      }

      if (options.dryRun) {
        await knexConn.rollback();
        logger.info(`ROLLBACK: ShareAttestationsToEligibleOrganizationsScript`);
        logger.info(`--dryRun false to persist changes`);
        return;
      }

      logger.info(`COMMIT: ShareAttestationsToEligibleOrganizationsScript`);
    });
  }

  async fetchProfileRewardNotShared() {
    const knexConn = DomainTransaction.getConnection();

    const queryBuilder = knexConn('profile-rewards')
      .select('profile-rewards.userId', 'profile-rewards.id', 'profile-rewards.rewardId')
      .leftJoin('organizations-profile-rewards', 'organizations-profile-rewards.profileRewardId', 'profile-rewards.id')
      .whereNull('organizations-profile-rewards.id')
      .orderBy('profile-rewards.id');

    return queryBuilder;
  }
}

await ScriptRunner.execute(import.meta.url, ShareAttestationsToEligibleOrganizationsScript);
