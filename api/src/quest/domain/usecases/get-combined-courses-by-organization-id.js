export default async ({ organizationId, combinedCourseRepository, combinedCourseParticipationRepository }) => {
  const combinedCourses = await combinedCourseRepository.findByOrganizationId({ organizationId });

  if (combinedCourses.length === 0) {
    return [];
  }

  const combinedCourseIds = combinedCourses.map((combinedCourse) => combinedCourse.id);

  const allCombinedCourseParticipations = await getAllCombinedCourseParticipations({
    combinedCourseIds,
    combinedCourseParticipationRepository,
  });

  return combinedCourses.map((combinedCourse) => {
    combinedCourse.participations = allCombinedCourseParticipations.filter(
      (participation) => participation.questId === combinedCourse.questId,
    );
    return combinedCourse;
  });
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
