export const findCombinedCourseParticipations = async ({
  combinedCourseId,
  page,
  combinedCourseParticipationRepository,
}) => {
  return combinedCourseParticipationRepository.findByCombinedCourseIds({ combinedCourseIds: [combinedCourseId], page });
};
