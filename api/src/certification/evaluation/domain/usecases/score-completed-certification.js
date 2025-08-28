/**
 * // TODO: cross bounded-context violation
 * @typedef {import('../../../session-management/domain/models/CertificationAssessment.js').CertificationAssessment} CertificationAssessment
 * @typedef {import('./index.js').Services} Services
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

/**
 * @param {Object} params
 * @param {CertificationAssessment} params.certificationAssessment
 * @param {string} params.locale
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {Services} params.services
 */
export const scoreCompletedCertification = withTransaction(
  async ({ assessmentId, locale, certificationCourseRepository, certificationAssessmentRepository, services }) => {
    const certificationAssessment = await certificationAssessmentRepository.get(assessmentId);

    if (certificationAssessment.isScoringBlockedDueToComplementaryOnlyChallenges) {
      return;
    }

    const certificationCourse = await services.handleV3CertificationScoring({
      certificationAssessment,
      locale,
      dependencies: { findByCertificationCourseIdAndAssessmentId: services.findByCertificationCourseIdAndAssessmentId },
    });

    certificationCourse.complete({ now: new Date() });
    await certificationCourseRepository.update({ certificationCourse });

    return services.scoreDoubleCertificationV3({ certificationCourseId: certificationCourse.getId() });
  },
);
