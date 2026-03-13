import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { AuditLoggingJob } from '../../../../shared/domain/models/jobs/AuditLoggingJob.js';

const deleteCampaignParticipation = async function ({
  userId,
  campaignId,
  campaignParticipationId,
  userRole,
  client,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
  auditLoggingJobRepository,
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

  const auditLoggingJobs = [];

  await DomainTransaction.execute(async () => {
    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId);
      await campaignParticipationRepository.remove(campaignParticipation.dataToUpdateOnDeletion);

      auditLoggingJobs.push(
        AuditLoggingJob.forUser({
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
    assessments.forEach((assessment) => assessment.detachCampaignParticipation());
    await assessmentRepository.batchRemoveParticipationId(assessments);
  });

  for (const auditLoggingJob of auditLoggingJobs) {
    await auditLoggingJobRepository.performAsync(auditLoggingJob);
  }
};

export { deleteCampaignParticipation };
