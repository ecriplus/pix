export async function getCombinedCourseByCode({
  userId,
  code,
  combinedCourseRepository,
  combinedCourseDetailsService,
}) {
  const combinedCourse = await combinedCourseRepository.getByCode({ code });
  return combinedCourseDetailsService.getCombinedCourseDetails({
    userId,
    combinedCourseId: combinedCourse.id,
  });
}
