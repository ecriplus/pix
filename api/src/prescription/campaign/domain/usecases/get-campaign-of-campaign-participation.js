const getCampaignOfCampaignParticipation = async function ({ campaignParticipationId, campaignRepository }) {
  return campaignRepository.getByCampaignParticipationId(campaignParticipationId);
};

export { getCampaignOfCampaignParticipation };
