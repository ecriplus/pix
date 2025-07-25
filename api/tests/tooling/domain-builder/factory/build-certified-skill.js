import { CertifiedSkill } from '../../../../src/certification/results/domain/read-models/CertifiedProfile.js';

const buildCertifiedSkill = function buildCertifiedSkill({
  id = 'someSkillId',
  name = 'someName',
  hasBeenAskedInCertif = false,
  tubeId = 'someTubeId',
  difficulty = 1,
} = {}) {
  return new CertifiedSkill({
    id,
    name,
    hasBeenAskedInCertif,
    tubeId,
    difficulty,
  });
};

export { buildCertifiedSkill };
