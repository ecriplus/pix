export async function getCombinedCourseByCode({
  userId,
  code,
  combinedCourseRepository,
  combinedCourseDetailsService,
  organizationLearnerPrescriptionRepository,
}) {
  const combinedCourse = await combinedCourseRepository.getByCode({ code });
  const organizationLearnerId = await organizationLearnerPrescriptionRepository.findIdByUserIdAndOrganizationId({
    userId,
    organizationId: combinedCourse.organizationId,
  });
  return combinedCourseDetailsService.getCombinedCourseDetails({
    organizationLearnerId,
    combinedCourseId: combinedCourse.id,
  });
}
