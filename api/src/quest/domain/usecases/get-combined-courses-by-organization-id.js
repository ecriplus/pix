export default async ({ organizationId, combinedCourseRepository, combinedCourseParticipationRepository }) => {
  const combinedCourses = await combinedCourseRepository.findByOrganizationId({ organizationId });

  if (combinedCourses.length === 0) {
    return [];
  }

  const combinedCourseIds = combinedCourses.map((combinedCourse) => combinedCourse.id);
  const { combinedCourseParticipations } = await combinedCourseParticipationRepository.findByCombinedCourseIds({
    combinedCourseIds,
  });

  return combinedCourses.map((combinedCourse) => {
    combinedCourse.participations = combinedCourseParticipations.filter(
      (participation) => participation.questId === combinedCourse.questId,
    );
    return combinedCourse;
  });
};
