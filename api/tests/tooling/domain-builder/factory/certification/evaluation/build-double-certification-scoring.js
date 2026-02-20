import { DoubleCertificationScoring } from '../../../../../../src/certification/evaluation/domain/models/DoubleCertificationScoring.js';

export const buildDoubleCertificationScoring = function ({
  complementaryCertificationCourseId = 99,
  complementaryCertificationBadgeId = 60,
  certificationCourseId = 42,
  pixScore,
  minimumEarnedPix,
  hasAcquiredPixCertification = true,
  isRejectedForFraud = false,
} = {}) {
  return new DoubleCertificationScoring({
    complementaryCertificationCourseId,
    complementaryCertificationBadgeId,
    certificationCourseId,
    pixScore,
    minimumEarnedPix,
    hasAcquiredPixCertification,
    isRejectedForFraud,
  });
};
