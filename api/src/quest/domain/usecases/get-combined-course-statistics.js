import { CombinedCourseStatistics } from '../models/CombinedCourseStatistics.js';

export const getCombinedCourseStatistics = async ({ combinedCourseId, combinedCourseParticipationRepository }) => {
  const allCombinedCourseParticipations = await getAllCombinedCourseParticipations({
    combinedCourseIds: [combinedCourseId],
    combinedCourseParticipationRepository,
  });

  const completedParticipations = allCombinedCourseParticipations.filter((participation) =>
    participation.isCompleted(),
  );

  return new CombinedCourseStatistics({
    id: combinedCourseId,
    participationsCount: allCombinedCourseParticipations.length,
    completedParticipationsCount: completedParticipations.length,
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
