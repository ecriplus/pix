import { EventLoggingJob } from '../../../../identity-access-management/domain/models/jobs/EventLoggingJob.js';
import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
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

  for (const organizationLearner of organizationLearnersToDelete) {
    organizationLearner.delete(userId, isAnonymizationWithDeletionEnabled);
    await organizationLearnerRepository.remove(organizationLearner.dataToUpdateOnDeletion);

    if (isAnonymizationWithDeletionEnabled) {
      await eventLoggingJobRepository.performAsync(
        new EventLoggingJob({
          client,
          action: organizationLearner.loggerContext,
          role: userRole,
          userId,
          targetUserId: organizationLearner.id,
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
          new EventLoggingJob({
            client,
            action: campaignParticipation.loggerContext,
            role: userRole,
            userId: userId,
            targetUserId: campaignParticipation.id,
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
