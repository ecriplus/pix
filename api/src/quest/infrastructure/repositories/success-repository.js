import { Success } from '../../domain/models/Success.js';

export const find = async ({ userId, campaignParticipationIds, knowledgeElementsApi, skillsApi, campaignsApi }) => {
  const knowledgeElements = await knowledgeElementsApi.findFilteredMostRecentByUser({ userId });
  const campaignSkillIds = await campaignsApi.findCampaignSkillIdsForCampaignParticipations(campaignParticipationIds);
  const campaignSkills = await skillsApi.findByIds({ ids: campaignSkillIds });
  return new Success({ knowledgeElements, campaignSkills });
};
