const findCampaignSkillIdsForCampaignParticipations = async function ({
  campaignParticipationIds,
  campaignRepository,
}) {
  return campaignRepository.findSkillIdsByCampaignParticipationIds({ campaignParticipationIds });
};

export { findCampaignSkillIdsForCampaignParticipations };
