export const findCombinedCourseParticipations = async ({ combinedCourseId, combinedCourseParticipationRepository }) => {
  return combinedCourseParticipationRepository.findByCombinedCourseIds({ combinedCourseIds: [combinedCourseId] });
};
