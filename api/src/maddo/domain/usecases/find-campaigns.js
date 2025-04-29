export async function findCampaigns({ organizationId, campaignRepository, page, locale }) {
  return campaignRepository.findByOrganizationId(organizationId, page, locale);
}
