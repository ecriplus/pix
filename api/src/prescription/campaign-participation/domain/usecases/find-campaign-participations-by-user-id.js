const findCampaignParticipationsByUserId = async function ({ userId, userCampaignParticipationRepository }) {
  return userCampaignParticipationRepository.findByUserId({ userId });
};

export { findCampaignParticipationsByUserId };
