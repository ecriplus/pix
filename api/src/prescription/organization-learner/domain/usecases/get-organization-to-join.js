export const getOrganizationToJoin = async function ({
  code,
  organizationToJoinRepository,
  campaignRepository,
  combinedCourseRepository,
}) {
  const campaign = await campaignRepository.getByCode(code);

  if (campaign) {
    return organizationToJoinRepository.get({ id: campaign.organizationId });
  }

  const combinedCourse = await combinedCourseRepository.getByCode({ code });

  return organizationToJoinRepository.get({
    id: combinedCourse.organizationId,
  });
};
