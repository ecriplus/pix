/**
 * // TODO: cross bounded-context violation
 * @typedef {import('../../../session-management/domain/models/CertificationAssessment.js').CertificationAssessment} CertificationAssessment
 * @typedef {import('./index.js').Services} Services
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js').CertificationAssessmentRepository} CertificationAssessmentRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const scoreCompletedCertification = withTransaction(
  /**
   * @param {Object} params
   * @param {number} params.certificationCourseId
   * @param {string} params.locale
   * @param {CertificationCourseRepository} params.certificationCourseRepository
   * @param {CertificationAssessmentRepository} params.certificationAssessmentRepository
   * @param {Services} params.services
   */
  async ({
    certificationCourseId,
    locale,
    certificationCourseRepository,
    certificationAssessmentRepository,
    services,
  }) => {
    const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
      certificationCourseId,
    });

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
