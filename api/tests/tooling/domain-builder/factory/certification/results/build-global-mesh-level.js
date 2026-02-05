import { GlobalCertificationLevel } from '../../../../../../src/certification/results/domain/models/v3/GlobalCertificationLevel.js';

export const buildGlobalCertificationLevel = function ({ score = 1, maxReachableLevel = 7 } = {}) {
  return new GlobalCertificationLevel({
    score,
    maxReachableLevel,
  });
};
