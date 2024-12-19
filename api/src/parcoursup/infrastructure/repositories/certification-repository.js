import { CertificationResult } from '../../domain/read-models/CertificationResult.js';

const get = ({ ine }) => {
  return new CertificationResult({ ine });
};

export { get };
