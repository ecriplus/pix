import { CombinedCourseStatistics } from '../models/CombinedCourseStatistics.js';

export const getCombinedCourseStatistics = async ({ combinedCourseId, combinedCourseParticipationRepository }) => {
  const participations = await combinedCourseParticipationRepository.findByCombinedCourseId({ combinedCourseId });
  const completedParticipations = participations.filter((participation) => participation.isCompleted());

  return new CombinedCourseStatistics({
    id: combinedCourseId,
    participationsCount: participations.length,
    completedParticipationsCount: completedParticipations.length,
  });
};
