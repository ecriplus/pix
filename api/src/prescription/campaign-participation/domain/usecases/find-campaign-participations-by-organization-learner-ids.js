const findCampaignParticipationsByOrganizationLearnerIds = async function ({
  organizationLearnerIds,
  campaignParticipationRepository,
}) {
  return campaignParticipationRepository.findByOrganizationLearnerIds({ organizationLearnerIds });
};

export { findCampaignParticipationsByOrganizationLearnerIds };
