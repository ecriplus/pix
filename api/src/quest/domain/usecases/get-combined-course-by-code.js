export async function getCombinedCourseByCode({
  userId,
  code,
  combinedCourseRepository,
  combinedCourseDetailsService,
  organizationLearnerPrescriptionRepository,
}) {
  const combinedCourse = await combinedCourseRepository.getByCode({ code });

  const combinedCourseDetails = await combinedCourseDetailsService.instantiateCombinedCourseDetails({
    combinedCourseId: combinedCourse.id,
  });

  if (!userId) {
    return combinedCourseDetails;
  }

  const organizationLearnerId = await organizationLearnerPrescriptionRepository.findIdByUserIdAndOrganizationId({
    userId,
    organizationId: combinedCourse.organizationId,
  });
  return combinedCourseDetailsService.getCombinedCourseDetails({
    organizationLearnerId,
    combinedCourseDetails,
  });
}
