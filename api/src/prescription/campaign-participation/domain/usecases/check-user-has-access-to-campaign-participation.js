export const checkUserHasAccessToCampaignParticipation = async ({
  userId,
  campaignParticipationId,
  campaignRepository,
}) => {
  const campaignId = await campaignRepository.getCampaignIdByCampaignParticipationId(campaignParticipationId);
  return await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);
};
