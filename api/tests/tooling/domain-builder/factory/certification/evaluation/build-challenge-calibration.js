import { ChallengeCalibration } from '../../../../../../src/certification/evaluation/domain/read-models/ChallengeCalibration.js';

const buildChallengeCalibration = function ({
  id = 123,
  discriminant = 0.5,
  difficulty = 2.1,
  certificationChallengeId = 'certificationChallengeId1',
} = {}) {
  return new ChallengeCalibration({
    id,
    discriminant,
    difficulty,
    certificationChallengeId,
  });
};

export { buildChallengeCalibration };
