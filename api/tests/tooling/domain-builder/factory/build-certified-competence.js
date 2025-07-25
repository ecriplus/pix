import { CertifiedCompetence } from '../../../../src/certification/results/domain/read-models/CertifiedProfile.js';

const buildCertifiedCompetence = function buildCertifiedCompetence({
  id = 'someCompetenceId',
  name = 'someName',
  areaId = 'someAreaId',
  origin = 'Pix',
} = {}) {
  return new CertifiedCompetence({
    id,
    name,
    areaId,
    origin,
  });
};

export { buildCertifiedCompetence };
