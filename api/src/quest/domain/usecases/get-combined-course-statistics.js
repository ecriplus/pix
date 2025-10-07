import { CombinedCourseStatistics } from '../models/CombinedCourseStatistics.js';

export const getCombinedCourseStatistics = async ({ combinedCourseId, combinedCourseParticipationRepository }) => {
  const { combinedCourseParticipations } = await combinedCourseParticipationRepository.findByCombinedCourseIds({
    combinedCourseIds: [combinedCourseId],
  });
  const completedParticipations = combinedCourseParticipations.filter((participation) => participation.isCompleted());

  return new CombinedCourseStatistics({
    id: combinedCourseId,
    participationsCount: combinedCourseParticipations.length,
    completedParticipationsCount: completedParticipations.length,
  });
};
