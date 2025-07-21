import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { EventLoggingJob } from '../../../../shared/domain/models/jobs/EventLoggingJob.js';
import { OrganizationLearnerList } from '../models/OrganizationLearnerList.js';

const deleteOrganizationLearners = withTransaction(async function ({
  organizationLearnerIds,
  userId,
  organizationId,
  userRole,
  client,
  organizationLearnerRepository,
  featureToggles,
  campaignParticipationRepositoryfromBC,
  badgeAcquisitionRepository,
  assessmentRepository,
  eventLoggingJobRepository,
  userRecommendedTrainingRepository,
  organizationsProfileRewardRepository,
}) {
  const organizationLearnersFromOrganization =
    await organizationLearnerRepository.findOrganizationLearnersByOrganizationId({
      organizationId,
    });

  const organizationLearnerList = new OrganizationLearnerList({
    organizationId,
    organizationLearners: organizationLearnersFromOrganization,
  });

  const organizationLearnersToDelete = organizationLearnerList.getDeletableOrganizationLearners(
    organizationLearnerIds,
    userId,
  );

  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  const organizationProfileRewards = await organizationsProfileRewardRepository.getByOrganizationId({ organizationId });

  for (const organizationLearner of organizationLearnersToDelete) {
    const organizationLearnerRewards = organizationProfileRewards.filter(
      (organizationProfileReward) => organizationProfileReward.userId === organizationLearner.userId,
    );
    organizationLearner.delete(userId, isAnonymizationWithDeletionEnabled);
    await organizationLearnerRepository.remove(organizationLearner.dataToUpdateOnDeletion);

    if (isAnonymizationWithDeletionEnabled) {
      for (const organizationLearnerReward of organizationLearnerRewards) {
        await organizationsProfileRewardRepository.remove(organizationLearnerReward);
      }

      await eventLoggingJobRepository.performAsync(
        EventLoggingJob.forUser({
          client,
          action: organizationLearner.loggerContext,
          role: userRole,
          userId: organizationLearner.id,
          updatedByUserId: userId,
          data: {},
        }),
      );
    }

    const campaignParticipations =
      await campaignParticipationRepositoryfromBC.getAllCampaignParticipationsForOrganizationLearner({
        organizationLearnerId: organizationLearner.id,
      });

    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId, isAnonymizationWithDeletionEnabled);
      await campaignParticipationRepositoryfromBC.remove(campaignParticipation.dataToUpdateOnDeletion);

      if (isAnonymizationWithDeletionEnabled) {
        await eventLoggingJobRepository.performAsync(
          EventLoggingJob.forUser({
            client,
            action: campaignParticipation.loggerContext,
            role: userRole,
            userId: campaignParticipation.id,
            updatedByUserId: userId,
            data: {},
          }),
        );
      }
    }

    if (isAnonymizationWithDeletionEnabled) {
      const campaignParticipationIds = campaignParticipations.map(({ id }) => id);
      await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
        campaignParticipationIds,
      );
      const assessments = await assessmentRepository.getByCampaignParticipationIds(campaignParticipationIds);
      for (const assessment of assessments) {
        assessment.detachCampaignParticipation();
        await assessmentRepository.updateCampaignParticipationId(assessment);
      }

      await userRecommendedTrainingRepository.deleteCampaignParticipationIds({ campaignParticipationIds });
    }
  }
});

export { deleteOrganizationLearners };
