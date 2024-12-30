import { CertificationResult } from '../../../../../src/parcoursup/domain/read-models/CertificationResult.js';

const buildCertificationResult = function ({
  ine = '1234',
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
