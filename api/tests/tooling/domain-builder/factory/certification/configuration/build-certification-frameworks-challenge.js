import { CertificationFrameworksChallenge } from '../../../../../../src/certification/configuration/domain/models/CertificationFrameworksChallenge.js';

export const buildCertificationFrameworksChallenge = function ({ challengeId = 'rec123', discriminant, difficulty }) {
  return new CertificationFrameworksChallenge({
    challengeId,
    discriminant,
    difficulty,
  });
};
