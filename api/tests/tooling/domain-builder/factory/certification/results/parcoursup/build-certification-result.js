import { CertificationResult } from '../../../../../../../src/certification/results/domain/read-models/parcoursup/CertificationResult.js';

const buildCertificationResult = function ({
  ine,
  organizationUai,
  lastName,
  firstName,
  birthdate,
  status,
  pixScore,
  certificationDate,
  competences,
}) {
  return new CertificationResult({
    ine,
    organizationUai,
    lastName,
    firstName,
    birthdate,
    status,
    pixScore,
    certificationDate,
    competences,
  });
};

export { buildCertificationResult };
