export async function getCampaignParticipations({ campaignId, campaignParticipationRepository }) {
  return campaignParticipationRepository.findByCampaignId(campaignId);
}
