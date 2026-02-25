import * as membershipRepository from '../../../shared/infrastructure/repositories/membership-repository.js';
import * as combinedCourseRepository from '../../infrastructure/repositories/combined-course-repository.js';
import * as checkDeletedOfCombinedCourse from './check-deleted-of-combined-course.js';

const execute = async function ({
  userId,
  combinedCourseId,
  dependencies = { membershipRepository, combinedCourseRepository },
}) {
  const { organizationId } = await dependencies.combinedCourseRepository.getById({ id: combinedCourseId });
  const authorized = await checkDeletedOfCombinedCourse.execute({ id: combinedCourseId });

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
