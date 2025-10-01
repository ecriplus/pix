import { CombinedCourseStatistics } from '../models/CombinedCourseStatistics.js';

export const getCombinedCourseStatistics = async ({ questId, combinedCourseParticipationRepository }) => {
  const participations = await combinedCourseParticipationRepository.findByQuestId({ questId });
  const completedParticipations = participations.filter((participation) => participation.isCompleted());

  return new CombinedCourseStatistics({
    id: questId,
    participationsCount: participations.length,
    completedParticipationsCount: completedParticipations.length,
  });
};
