/**
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js').SessionRepository} SessionRepository
 * @typedef {import('./index.js').CertificationRescoringRepository} CertificationRescoringRepository
 * @typedef {import('./index.js').CourseAssessmentResultRepository} CourseAssessmentResultRepository
 */

import CertificationCancelled from '../../../../../src/shared/domain/events/CertificationCancelled.js';
import { CertificationCancelNotAllowedError, NotFinalizedSessionError } from '../../../../shared/domain/errors.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';

/**
 * @param {Object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {SessionRepository} params.sessionRepository
 * @param {CertificationRescoringRepository} params.certificationRescoringRepository
 * @param {CourseAssessmentResultRepository} params.courseAssessmentResultRepository
 */
export const cancel = async function ({
  certificationCourseId,
  juryId,
  certificationCourseRepository,
  sessionRepository,
  certificationRescoringRepository,
  courseAssessmentResultRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  const session = await sessionRepository.get({ id: certificationCourse.getSessionId() });
  if (!session.isFinalized) {
    throw new NotFinalizedSessionError();
  }

  const latestAssessmentResult = await courseAssessmentResultRepository.getLatestAssessmentResult({
    certificationCourseId,
  });
  if (latestAssessmentResult && latestAssessmentResult.status === 'rejected') {
    throw new CertificationCancelNotAllowedError();
  }

  const event = new CertificationCancelled({
    certificationCourseId,
    juryId,
  });

  if (AlgorithmEngineVersion.isV3(certificationCourse.getVersion())) {
    await certificationRescoringRepository.rescoreV3Certification({ event });
  }

  if (AlgorithmEngineVersion.isV2(certificationCourse.getVersion())) {
    await certificationRescoringRepository.rescoreV2Certification({ event });
  }
};
