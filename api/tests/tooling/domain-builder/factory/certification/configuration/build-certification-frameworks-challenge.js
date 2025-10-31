import { CertificationFrameworksChallenge } from '../../../../../../src/certification/configuration/domain/models/CertificationFrameworksChallenge.js';

export const buildCertificationFrameworksChallenge = function ({
  versionId = 1,
  challengeId = 'rec123',
  discriminant,
  difficulty,
}) {
  return new CertificationFrameworksChallenge({
    versionId,
    challengeId,
    discriminant,
    difficulty,
  });
};
