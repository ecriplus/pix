import { CertificationEligibility } from '../../../../../../src/certification/enrolment/domain/read-models/UserCertificationEligibility.js';

const buildCertificationEligibility = function ({
  label = "Label d'éligibilité",
  imageUrl = "url d'image",
  isBadgeValid = true,
  validatedDoubleCertification = true,
} = {}) {
  return new CertificationEligibility({
    label,
    imageUrl,
    isBadgeValid,
    validatedDoubleCertification,
  });
};

export { buildCertificationEligibility };
