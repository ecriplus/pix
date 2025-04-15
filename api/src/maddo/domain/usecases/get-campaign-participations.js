export async function getCampaignParticipations({ campaignId, clientId, campaignParticipationRepository }) {
  return campaignParticipationRepository.findByCampaignId(campaignId, clientId);
}
