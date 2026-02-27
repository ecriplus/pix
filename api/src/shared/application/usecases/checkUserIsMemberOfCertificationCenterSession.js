import * as sessionRepository from '../../../certification/session-management/infrastructure/repositories/session-management-repository.js';
import * as certificationCourseRepository from '../../../certification/shared/infrastructure/repositories/certification-course-repository.js';

const execute = async function ({
  userId,
  certificationCourseId,
  dependencies = { certificationCourseRepository, sessionRepository },
}) {
  const certificationCourse = await dependencies.certificationCourseRepository.get({ id: certificationCourseId });
  return dependencies.sessionRepository.doesUserHaveCertificationCenterMembershipForSession({
    userId,
    sessionId: certificationCourse.getSessionId(),
  });
};

export { execute };
