export async function getCampaignParticipations({
  campaignId,
  clientId,
  page,
  since,
  campaignParticipationRepository,
}) {
  return campaignParticipationRepository.findByCampaignId(campaignId, clientId, page, since);
}
