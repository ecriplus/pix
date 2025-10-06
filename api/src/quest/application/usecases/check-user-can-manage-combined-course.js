import * as membershipRepository from '../../../shared/infrastructure/repositories/membership-repository.js';
import * as combinedCourseRepository from '../../infrastructure/repositories/combined-course-repository.js';

const execute = async function ({
  userId,
  combinedCourseId,
  dependencies = { membershipRepository, combinedCourseRepository },
}) {
  const { organizationId } = await dependencies.combinedCourseRepository.getById({ id: combinedCourseId });
  const memberships = await dependencies.membershipRepository.findByUserIdAndOrganizationId({
    userId,
    organizationId,
  });

  return memberships.length > 0;
};

export { execute };
