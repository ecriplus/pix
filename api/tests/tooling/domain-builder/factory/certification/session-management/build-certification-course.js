import { CertificationCourse } from '../../../../../../src/certification/session-management/domain/models/CertificationCourse.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';

export function buildCertificationCourse({
  id = 456,
  version = 3,
  updatedAt = new Date(),
  endedAt = null,
  completedAt = null,
  abortReason = null,
  assessmentId = 789,
  assessmentState = Assessment.states.STARTED,
  assessmentLatestActivityAt = new Date(),
} = {}) {
  return new CertificationCourse({
    id,
    version,
    updatedAt,
    endedAt,
    completedAt,
    abortReason,
    assessmentId,
    assessmentState,
    assessmentLatestActivityAt,
  });
}
