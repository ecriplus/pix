import { CertificationAlgorithmVersionError, NotFinalizedSessionError } from '../../../../shared/domain/errors.js';
import { SessionAlreadyPublishedError } from '../../../session-management/domain/errors.js';
import CertificationRescoredByScript from '../../../session-management/domain/events/CertificationRescoredByScript.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';

export const rescoreCertification = async ({
  certificationCourseId,
  locale,
  certificationAssessmentRepository,
  evaluationSessionRepository,
  services,
}) => {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  if (!AlgorithmEngineVersion.isV3(certificationAssessment.version)) {
    throw new CertificationAlgorithmVersionError();
  }

  const session = await evaluationSessionRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  if (!session.isFinalized) {
    throw new NotFinalizedSessionError();
  }

  if (session.isPublished) {
    throw new SessionAlreadyPublishedError();
  }

  return services.handleV3CertificationScoring({
    event: new CertificationRescoredByScript({ certificationCourseId }),
    certificationAssessment,
    locale,
    dependencies: { findByCertificationCourseIdAndAssessmentId: services.findByCertificationCourseIdAndAssessmentId },
  });
};
