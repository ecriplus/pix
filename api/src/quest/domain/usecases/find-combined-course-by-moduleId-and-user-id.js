export const findCombinedCourseByModuleIdAndUserId = async ({
  moduleId,
  userId,
  combinedCourseRepository,
  organizationLearnerRepository,
}) => {
  const learners = await organizationLearnerRepository.findByUserId({ userId });
  const organizationIds = learners.map((learner) => learner.organizationId);

  return combinedCourseRepository.findByModuleIdAndOrganizationIds({ moduleId, organizationIds });
};
