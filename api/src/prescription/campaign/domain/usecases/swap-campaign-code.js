import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { SwapCampaignMismatchOrganizationError } from '../errors.js';

const swapCampaignCodes = withTransaction(async function ({
  firstCampaignId,
  secondCampaignId,
  campaignAdministrationRepository,
}) {
  const isFromSameOrganization = await campaignAdministrationRepository.isFromSameOrganization({
    firstCampaignId,
    secondCampaignId,
  });

  if (!isFromSameOrganization) {
    throw new SwapCampaignMismatchOrganizationError();
  }

  return campaignAdministrationRepository.swapCampaignCodes({ firstCampaignId, secondCampaignId });
});

export { swapCampaignCodes };
