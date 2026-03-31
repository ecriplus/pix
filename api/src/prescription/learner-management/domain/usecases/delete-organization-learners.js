import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { AuditLoggingJob } from '../../../../shared/domain/models/jobs/AuditLoggingJob.js';
import { OrganizationLearnerList } from '../models/OrganizationLearnerList.js';

const deleteOrganizationLearners = async function ({
  organizationLearnerIds,
  userId,
  organizationId,
  userRole,
  client,
  organizationLearnerRepository,
  organizationLearnerImportFormatRepository,
  campaignParticipationRepositoryFromBC,
  badgeAcquisitionRepository,
  assessmentRepository,
  auditLoggingJobRepository,
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

  const importFormat = await organizationLearnerImportFormatRepository.get(organizationId);
  const organizationProfileRewards = await organizationsProfileRewardRepository.getByOrganizationId({ organizationId });

  const auditLoggingJobs = [];
  const campaignParticipationsToDelete = [];
  const allCampaignParticipationIds = [];

  await DomainTransaction.execute(async () => {
    const organizationLearnersToUpdate = [];
    const organizationProfileRewardsToUpdate = [];
    const organizationLearnerIds = [];

    for (const organizationLearner of organizationLearnersToDelete) {
      organizationLearnerIds.push(organizationLearner.id);
      const organizationLearnerRewards = organizationProfileRewards.filter(
        (organizationProfileReward) => organizationProfileReward.userId === organizationLearner.userId,
      );
      organizationLearner.delete(userId, importFormat);
      organizationLearnersToUpdate.push(organizationLearner.dataToUpdateOnDeletion);
      organizationProfileRewardsToUpdate.push(...organizationLearnerRewards);

      auditLoggingJobs.push(
        AuditLoggingJob.forUser({
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
      await campaignParticipationRepositoryFromBC.getAllCampaignParticipationsForOrganizationLearnerIds({
        organizationLearnerIds,
        withDeletedParticipation: keepPreviousDeletion,
      });

    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId);
      campaignParticipationsToDelete.push(campaignParticipation.dataToUpdateOnDeletion);
      allCampaignParticipationIds.push(campaignParticipation.id);

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

    const assessments = await assessmentRepository.getByCampaignParticipationIds(allCampaignParticipationIds);
    assessments.forEach((assessment) => assessment.detachCampaignParticipation());

    await organizationLearnerRepository.updateInBatchByIds(organizationLearnersToUpdate);
    await campaignParticipationRepositoryFromBC.updateInBatchByIds(campaignParticipationsToDelete);
    await assessmentRepository.batchRemoveParticipationId(assessments);
    await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
      allCampaignParticipationIds,
    );
    await organizationsProfileRewardRepository.removeInBatch(organizationProfileRewardsToUpdate);
    await userRecommendedTrainingRepository.deleteCampaignParticipationIds({
      campaignParticipationIds: allCampaignParticipationIds,
    });
  });

  for (const auditLoggingJob of auditLoggingJobs) {
    await auditLoggingJobRepository.performAsync(auditLoggingJob);
  }
};

export { deleteOrganizationLearners };
