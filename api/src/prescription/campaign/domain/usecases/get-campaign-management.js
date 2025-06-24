import { NotFoundError } from '../../../../shared/application/http-errors.js';

const getCampaignManagement = async function ({ campaignId, campaignManagementRepository }) {
  const campaign = await campaignManagementRepository.get(campaignId);
  if (!campaign) {
    throw new NotFoundError('campaign does not exist');
  }
  return campaign;
};

export { getCampaignManagement };
