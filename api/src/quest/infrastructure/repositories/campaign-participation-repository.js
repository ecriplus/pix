export async function deleteCampaignParticipations({
  userId,
  campaignId,
  campaignParticipationIds,
  userRole,
  client,
  campaignParticipationsApi,
  keepPreviousDeletion,
}) {
  return campaignParticipationsApi.deleteCampaignParticipations({
    userId,
    campaignParticipationIds,
    campaignId,
    keepPreviousDeletion,
    userRole,
    client,
  });
}

export async function getCampaignParticipationsByLearnerIdAndCampaignId({
  organizationLearnerId,
  campaignId,
  campaignParticipationsApi,
}) {
  return campaignParticipationsApi.getCampaignParticipationsByLearnerIdAndCampaignId({
    organizationLearnerId,
    campaignId,
  });
}
