import * as combinedCourseParticipantRepository from '../../infrastructure/repositories/combined-course-participant-repository.js';
import * as combinedCourseRepository from '../../infrastructure/repositories/combined-course-repository.js';

const execute = async function ({ userId, code }) {
  const { organizationId } = await combinedCourseRepository.getByCode({ code });
  const organizationLearner = await combinedCourseParticipantRepository.findOrganizationLearner({
    userId,
    organizationId,
  });
  return Boolean(organizationLearner);
};

export { execute };
