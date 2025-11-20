import { CalibratedChallengeSkill } from '../../../../../../src/certification/evaluation/domain/models/CalibratedChallengeSkill.js';

export function buildCalibratedChallengeSkill({
  id = 'recSkill1',
  name = 'skill1',
  competenceId = 'competenceId',
  tubeId = 'tubeId',
} = {}) {
  return new CalibratedChallengeSkill({
    id,
    name,
    competenceId,
    tubeId,
  });
}
