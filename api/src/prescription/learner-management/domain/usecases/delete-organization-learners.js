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
  campaignParticipationRepositoryFromBC,
  badgeAcquisitionRepository,
  assessmentRepository,
  eventLoggingJobRepository,
  userRecommendedTrainingRepository,
  organizationsProfileRewardRepository,
  keepPreviousDeletion = false,
}) {
  if (organizationLearnerIds.length === 0) {
    return;
  }

  const organizationLearnersFromOrganization =
    await organizationLearnerRepository.findOrganizationLearnersByOrganizationIdAndLearnerIds({
      organizationId,
      organizationLearnerIds,
      keepPreviousDeletion,
    });

  const organizationLearnerList = new OrganizationLearnerList({
    organizationId,
    organizationLearners: organizationLearnersFromOrganization,
  });

  const organizationLearnersToDelete = organizationLearnerList.getDeletableOrganizationLearners(
    organizationLearnerIds,
    userId,
  );

  const organizationProfileRewards = await organizationsProfileRewardRepository.getByOrganizationId({ organizationId });

  for (const organizationLearner of organizationLearnersToDelete) {
    const organizationLearnerRewards = organizationProfileRewards.filter(
      (organizationProfileReward) => organizationProfileReward.userId === organizationLearner.userId,
    );
    organizationLearner.delete(userId, { keepPreviousDeletion });
    await organizationLearnerRepository.remove(organizationLearner.dataToUpdateOnDeletion);

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

    const campaignParticipations =
      await campaignParticipationRepositoryFromBC.getAllCampaignParticipationsForOrganizationLearner({
        organizationLearnerId: organizationLearner.id,
        withDeletedParticipation: keepPreviousDeletion,
      });

    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId);
      await campaignParticipationRepositoryFromBC.remove(campaignParticipation.dataToUpdateOnDeletion);

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
});

export { deleteOrganizationLearners };
