export const getOrganizationLearnerWithParticipations = async function ({
  organizationId,
  userId,
  organizationLearnerRepository,
  organizationRepository,
  campaignParticipationOverviewRepository,
  tagRepository,
}) {
  const organizationLearnerId = await organizationLearnerRepository.getIdByUserIdAndOrganizationId({
    organizationId,
    userId,
  });
  const organization = await organizationRepository.get(organizationId);
  const campaignParticipationOverviews = await campaignParticipationOverviewRepository.findByOrganizationLearnerId({
    organizationLearnerId,
  });
  const tags = await tagRepository.findByIds(organization.tags.map((tag) => tag.id));

  return {
    organizationLearner: { id: organizationLearnerId },
    organization,
    campaignParticipations: campaignParticipationOverviews,
    tagNames: tags.map((tag) => tag.name),
  };
};
