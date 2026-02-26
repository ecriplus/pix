import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { EventLoggingJob } from '../../../../shared/domain/models/jobs/EventLoggingJob.js';

const deleteCampaignParticipation = async function ({
  userId,
  campaignId,
  campaignParticipationId,
  userRole,
  client,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
  eventLoggingJobRepository,
  assessmentRepository,
  userRecommendedTrainingRepository,
  keepPreviousDeleted = false,
}) {
  const campaignParticipations =
    await campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
      campaignId,
      campaignParticipationId,
      keepPreviousDeleted,
    });

  const eventLoggingJobs = [];

  await DomainTransaction.execute(async () => {
    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId);
      await campaignParticipationRepository.remove(campaignParticipation.dataToUpdateOnDeletion);

      eventLoggingJobs.push(
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
    await userRecommendedTrainingRepository.deleteCampaignParticipationIds({ campaignParticipationIds });

    const assessments = await assessmentRepository.getByCampaignParticipationIds(campaignParticipationIds);
    for (const assessment of assessments) {
      assessment.detachCampaignParticipation();
      await assessmentRepository.updateCampaignParticipationId(assessment);
    }
  });

  for (const eventLoggingJob of eventLoggingJobs) {
    await eventLoggingJobRepository.performAsync(eventLoggingJob);
  }
};

export { deleteCampaignParticipation };
