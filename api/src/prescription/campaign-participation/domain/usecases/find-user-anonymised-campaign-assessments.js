const findUserAnonymisedCampaignAssessments = async function ({ userId, campaignAssessmentParticipationRepository }) {
  return await campaignAssessmentParticipationRepository.getDetachedByUserId({ userId });
};
export { findUserAnonymisedCampaignAssessments };
