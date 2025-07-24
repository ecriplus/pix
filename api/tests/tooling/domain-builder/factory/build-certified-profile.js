import { CertifiedProfile } from '../../../../src/certification/results/domain/read-models/CertifiedProfile.js';

const buildCertifiedProfile = function buildCertifiedProfile({
  id = 123,
  userId = 456,
  certifiedSkills = [],
  certifiedTubes = [],
  certifiedCompetences = [],
  certifiedAreas = [],
} = {}) {
  return new CertifiedProfile({
    id,
    userId,
    certifiedSkills,
    certifiedTubes,
    certifiedCompetences,
    certifiedAreas,
  });
};

export { buildCertifiedProfile };
