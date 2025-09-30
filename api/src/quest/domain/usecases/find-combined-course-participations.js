export const findCombinedCourseParticipations = async ({ questId, combinedCourseParticipationRepository }) => {
  return combinedCourseParticipationRepository.findByQuestId({ questId });
};
