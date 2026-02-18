/**
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js').SessionRepository} SessionRepository
 * @typedef {import('./index.js').CertificationEvaluationRepository} CertificationEvaluationRepository
 * @typedef {import('./index.js').CourseAssessmentResultRepository} CourseAssessmentResultRepository
 */

import CertificationCancelled from '../../../../../src/shared/domain/events/CertificationCancelled.js';
import { CertificationCancelNotAllowedError, NotFinalizedSessionError } from '../../../../shared/domain/errors.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';

/**
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {SessionRepository} params.sessionRepository
 * @param {CertificationEvaluationRepository} params.certificationEvaluationRepository
 * @param {CourseAssessmentResultRepository} params.courseAssessmentResultRepository
 */
export const cancel = async function ({
  certificationCourseId,
  juryId,
  certificationCourseRepository,
  sessionRepository,
  certificationEvaluationRepository,
  courseAssessmentResultRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  const isSessionFinalized = await sessionRepository.isFinalized({ id: certificationCourse.getSessionId() });
  if (!isSessionFinalized) {
    throw new NotFinalizedSessionError();
  }

  const latestAssessmentResult = await courseAssessmentResultRepository.getLatestAssessmentResult({
    certificationCourseId,
  });
  if (!latestAssessmentResult) {
    throw new NotFoundError('No assessment result found');
  }
  if (latestAssessmentResult.status === 'rejected') {
    throw new CertificationCancelNotAllowedError();
  }

  const event = new CertificationCancelled({
    certificationCourseId,
    juryId,
  });

  if (AlgorithmEngineVersion.isV3(certificationCourse.getVersion())) {
    await certificationEvaluationRepository.rescoreV3Certification({ event });
  }

  if (AlgorithmEngineVersion.isV2(certificationCourse.getVersion())) {
    await certificationEvaluationRepository.rescoreV2Certification({ event });
  }
};
