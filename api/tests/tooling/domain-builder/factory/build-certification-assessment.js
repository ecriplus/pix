import { CertificationAssessment } from '../../../../src/certification/session-management/domain/models/CertificationAssessment.js';
import { buildCertificationChallengeWithType } from './build-certification-challenge-with-type.js';

export function buildCertificationAssessment({
  id = 123,
  userId = 123,
  certificationCourseId = 123,
  createdAt = new Date('2020-01-01'),
  lastAnswerAt = null,
  state = CertificationAssessment.states.STARTED,
  version = 2,
  certificationChallenges = [buildCertificationChallengeWithType()],
  certificationAnswersByDate = [],
} = {}) {
  return new CertificationAssessment({
    id,
    userId,
    certificationCourseId,
    createdAt,
    lastAnswerAt,
    state,
    version,
    certificationChallenges,
    certificationAnswersByDate,
  });
}
