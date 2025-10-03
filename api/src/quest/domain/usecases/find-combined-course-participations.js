export const findCombinedCourseParticipations = async ({ combinedCourseId, combinedCourseParticipationRepository }) => {
  return combinedCourseParticipationRepository.findByCombinedCourseId({ combinedCourseId });
};
