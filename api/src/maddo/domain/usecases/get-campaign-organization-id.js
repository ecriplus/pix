export async function getCampaignOrganizationId({ campaignId, campaignRepository }) {
  return campaignRepository.getOrganizationId(campaignId);
}
