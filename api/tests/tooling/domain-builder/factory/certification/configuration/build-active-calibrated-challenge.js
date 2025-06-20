import { ActiveCalibratedChallenge } from '../../../../../../src/certification/configuration/domain/read-models/ActiveCalibratedChallenge.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';

export const buildActiveCalibratedChallenge = function ({
  scope = ComplementaryCertificationKeys.PIX_PLUS_DROIT,
  discriminant = 1.4,
  difficulty = 2.2,
  challengeId = 'rec123',
} = {}) {
  return new ActiveCalibratedChallenge({ scope, discriminant, difficulty, challengeId });
};
