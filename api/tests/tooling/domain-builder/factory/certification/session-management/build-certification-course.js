import { CertificationCourse } from '../../../../../../src/certification/session-management/domain/models/CertificationCourse.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';

export function buildCertificationCourse({
  id = 456,
  version = 3,
  updatedAt = new Date(),
  completedAt = null,
  abortReason = null,
  assessmentState = Assessment.states.STARTED,
} = {}) {
  return new CertificationCourse({
    id,
    version,
    updatedAt,
    completedAt,
    abortReason,
    assessmentState,
  });
}
