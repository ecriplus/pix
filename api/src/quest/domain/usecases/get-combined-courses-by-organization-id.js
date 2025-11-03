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

  const allCombinedCourseParticipations = await getAllCombinedCourseParticipations({
    combinedCourseIds,
    combinedCourseParticipationRepository,
  });

  const combinedCoursesWithParticipations = combinedCourses.map((combinedCourse) => {
    combinedCourse.participations = allCombinedCourseParticipations.filter(
      (participation) => participation.combinedCourseId === combinedCourse.id,
    );
    return combinedCourse;
  });

  return { combinedCourses: combinedCoursesWithParticipations, meta };
};

async function getAllCombinedCourseParticipations({ combinedCourseIds, combinedCourseParticipationRepository }) {
  let results,
    allCombinedCourseParticipations = [];
  const page = { number: 1, size: 100 };

  do {
    results = await combinedCourseParticipationRepository.findByCombinedCourseIds({
      combinedCourseIds,
      page,
    });
    allCombinedCourseParticipations = allCombinedCourseParticipations.concat(results.combinedCourseParticipations);
    page.number += 1;
  } while (results.combinedCourseParticipations.length > 0);

  return allCombinedCourseParticipations;
}
