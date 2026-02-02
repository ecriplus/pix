import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { UserNotAuthorizedToAccessEntityError } from '../../../../shared/domain/errors.js';

const findPaginatedCampaignParticipantActivities = withTransaction(async function ({
  userId,
  campaignId,
  page,
  filters,
  campaignRepository,
  campaignParticipantActivityRepository,
}) {
  await _checkUserAccessToCampaign(campaignId, userId, campaignRepository);
  return campaignParticipantActivityRepository.findPaginatedByCampaignId({
    page,
    campaignId,
    filters,
  });
});

export { findPaginatedCampaignParticipantActivities };

async function _checkUserAccessToCampaign(campaignId, userId, campaignRepository) {
  const hasAccess = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);
  if (!hasAccess) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to an organization that owns the campaign');
  }
}
