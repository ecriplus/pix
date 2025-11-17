export default async ({ organizationId, page, combinedCourseRepository, combinedCourseParticipationRepository }) => {
  const { combinedCourses, meta } = await combinedCourseRepository.findByOrganizationId({
    organizationId,
    page: page?.number,
    size: page?.size,
  });

  if (combinedCourses.length === 0) {
    return { combinedCourses: [], meta };
  }

  const combinedCourseIds = combinedCourses.map((combinedCourse) => combinedCourse.id);

  const allCombinedCourseParticipations = await combinedCourseParticipationRepository.findByCombinedCourseIds({
    combinedCourseIds,
  });

  const combinedCoursesWithParticipations = combinedCourses.map((combinedCourse) => {
    combinedCourse.participations = allCombinedCourseParticipations.filter(
      (participation) => participation.combinedCourseId === combinedCourse.id,
    );
    return combinedCourse;
  });

  return { combinedCourses: combinedCoursesWithParticipations, meta };
};
