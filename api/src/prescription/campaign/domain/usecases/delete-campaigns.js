import { CampaignsDestructor } from '../models/CampaignsDestructor.js';

const deleteCampaigns = async ({
  userId,
  organizationId,
  campaignIds,
  featureToggles,
  organizationMembershipRepository,
  campaignAdministrationRepository,
  campaignParticipationRepository,
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

  await campaignParticipationRepository.batchUpdate(campaignParticipationsToDelete);
  await campaignAdministrationRepository.remove(campaignsToDelete);
};

export { deleteCampaigns };
