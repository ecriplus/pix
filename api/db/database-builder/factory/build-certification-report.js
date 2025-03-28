import _ from 'lodash';

import { CertificationReport } from '../../../src/certification/shared/domain/models/CertificationReport.js';
import { buildCertificationCourse } from './build-certification-course.js';

const buildCertificationReport = function ({
  firstName = 'Bobby',
  lastName = 'Lapointe',
  isCompleted = true,
  certificationCourseId,
  sessionId,
  abortReason = null,
} = {}) {
  certificationCourseId = _.isUndefined(certificationCourseId)
    ? buildCertificationCourse({ firstName, lastName, sessionId, abortReason }).id
    : certificationCourseId;

  const id = CertificationReport.idFromCertificationCourseId(certificationCourseId);

  const values = {
    id,
    firstName,
    lastName,
    isCompleted,
    certificationCourseId,
    abortReason,
  };
  return values;
};

export { buildCertificationReport };
