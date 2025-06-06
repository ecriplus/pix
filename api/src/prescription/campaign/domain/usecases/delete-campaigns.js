import { EventLoggingJob } from '../../../../identity-access-management/domain/models/jobs/EventLoggingJob.js';
import { CampaignsDestructor } from '../models/CampaignsDestructor.js';

const deleteCampaigns = async ({
  userId,
  organizationId,
  campaignIds,
  featureToggles,
  organizationMembershipRepository,
  campaignAdministrationRepository,
  campaignParticipationRepository,
  eventLoggingJobRepository,
}) => {
  const membership = await organizationMembershipRepository.getByUserIdAndOrganizationId({ userId, organizationId });
  const campaignsToDelete = await campaignAdministrationRepository.getByIds(campaignIds);
  const campaignParticipationsToDelete = await campaignParticipationRepository.getByCampaignIds(campaignIds);

  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  const campaignDestructor = new CampaignsDestructor({
    campaignsToDelete,
    campaignParticipationsToDelete,
    userId,
    organizationId,
    membership,
  });
  campaignDestructor.delete(isAnonymizationWithDeletionEnabled);

  campaignDestructor.campaignParticipations.forEach(async (campaignParticipation) => {
    await campaignParticipationRepository.update(campaignParticipation);

    if (isAnonymizationWithDeletionEnabled) {
      await eventLoggingJobRepository.performAsync(
        new EventLoggingJob({
          client: 'PIX_ORGA',
          action: campaignParticipation.loggerContext,
          role: 'ORGA_ADMIN',
          userId: userId,
          targetUserId: campaignParticipation.id,
          data: {},
        }),
      );
    }
  });

  await campaignAdministrationRepository.remove(campaignsToDelete);
};

export { deleteCampaigns };
