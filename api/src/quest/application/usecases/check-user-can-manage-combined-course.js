import * as membershipRepository from '../../../shared/infrastructure/repositories/membership-repository.js';
import * as combinedCourseRepository from '../../infrastructure/repositories/combined-course-repository.js';
import * as checkCombinedCourseIsNotDeleted from './check-combined-course-is-not-deleted.js';

const execute = async function ({
  userId,
  combinedCourseId,
  dependencies = { membershipRepository, combinedCourseRepository },
}) {
  const { organizationId } = await dependencies.combinedCourseRepository.getById({ id: combinedCourseId });
  const authorized = await checkCombinedCourseIsNotDeleted.execute({ id: combinedCourseId });

  if (!authorized) {
    return false;
  }
  const memberships = await dependencies.membershipRepository.findByUserIdAndOrganizationId({
    userId,
    organizationId,
  });

  return memberships.length > 0;
};

export { execute };
