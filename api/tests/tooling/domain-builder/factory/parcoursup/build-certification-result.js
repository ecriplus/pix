import { CertificationResult } from '../../../../../src/parcoursup/domain/read-models/CertificationResult.js';

const buildCertificationResult = function ({ ine = '1234' }) {
  return new CertificationResult({ ine });
};

export { buildCertificationResult };
