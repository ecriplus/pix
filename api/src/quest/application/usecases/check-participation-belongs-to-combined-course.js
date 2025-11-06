import * as combinedCourseParticipationRepository from '../../infrastructure/repositories/combined-course-participation-repository.js';

export const execute = async function ({ combinedCourseId, participationId }) {
  return await combinedCourseParticipationRepository.isParticipationOnCombinedCourse({
    combinedCourseId,
    participationId,
  });
};
