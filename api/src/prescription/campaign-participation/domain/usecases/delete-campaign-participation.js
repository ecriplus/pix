import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { EventLoggingJob } from '../../../../shared/domain/models/jobs/EventLoggingJob.js';

const deleteCampaignParticipation = withTransaction(async function ({
  userId,
  campaignId,
  campaignParticipationId,
  userRole,
  client,
  featureToggles,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
  eventLoggingJobRepository,
  assessmentRepository,
  userRecommendedTrainingRepository,
}) {
  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  const campaignParticipations =
    await campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
      campaignId,
      campaignParticipationId,
    });

  for (const campaignParticipation of campaignParticipations) {
    campaignParticipation.delete(userId, isAnonymizationWithDeletionEnabled);
    await campaignParticipationRepository.remove(campaignParticipation.dataToUpdateOnDeletion);

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
    await userRecommendedTrainingRepository.deleteCampaignParticipationIds({ campaignParticipationIds });

    const assessments = await assessmentRepository.getByCampaignParticipationIds(campaignParticipationIds);
    for (const assessment of assessments) {
      assessment.detachCampaignParticipation();
      await assessmentRepository.updateCampaignParticipationId(assessment);
    }
  }
});

export { deleteCampaignParticipation };
