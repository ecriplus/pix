import { CalibratedChallenge } from '../../../../src/certification/evaluation/domain/models/CalibratedChallenge.js';

export function buildCalibratedChallenge({
  id = 'recCHAL1',
  discriminant = 1,
  difficulty = 0,
  blindnessCompatibility = 'OK',
  colorBlindnessCompatibility = 'RAS',
} = {}) {
  return new CalibratedChallenge({
    id,
    discriminant,
    difficulty,
    blindnessCompatibility,
    colorBlindnessCompatibility,
  });
}
