import { CalibratedChallenge } from '../../../../src/certification/evaluation/domain/models/CalibratedChallenge.js';
import { buildCalibratedChallengeSkill } from './build-calibrated-challenge-skill.js';

export function buildCalibratedChallenge({
  id = 'recCHAL1',
  discriminant = 1,
  difficulty = 0,
  blindnessCompatibility = 'OK',
  colorBlindnessCompatibility = 'RAS',
  competenceId = 'competenceId',
  skill = buildCalibratedChallengeSkill(),
} = {}) {
  return new CalibratedChallenge({
    id,
    discriminant,
    difficulty,
    blindnessCompatibility,
    colorBlindnessCompatibility,
    competenceId,
    skill,
  });
}
