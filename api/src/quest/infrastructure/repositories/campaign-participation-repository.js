export async function deleteCampaignParticipationsInCombinedCourse({
  userId,
  campaignId,
  campaignParticipationIds,
  userRole,
  client,
  campaignParticipationsApi,
  keepPreviousDeletion,
}) {
  return campaignParticipationsApi.deleteCampaignParticipationsInCombinedCourse({
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
