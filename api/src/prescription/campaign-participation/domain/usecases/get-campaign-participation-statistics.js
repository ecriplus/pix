const getCampaignParticipationStatistics = async ({
  organizationId,
  ownerId,
  campaignParticipationStatisticsRepository,
}) =>
  await campaignParticipationStatisticsRepository.getParticipationCountOnPrescriberCampaigns(organizationId, ownerId);

export { getCampaignParticipationStatistics };
