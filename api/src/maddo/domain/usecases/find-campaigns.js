export async function findCampaigns({ organizationId, campaignRepository }) {
  return campaignRepository.findByOrganizationId(organizationId);
}
