const findActiveCampaignIdsByOrganization = function ({ organizationId, campaignManagementRepository }) {
  return campaignManagementRepository.findActiveCampaignIdsByOrganization({ organizationId });
};

export { findActiveCampaignIdsByOrganization };
