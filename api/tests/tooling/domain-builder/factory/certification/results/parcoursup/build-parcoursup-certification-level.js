import { ParcoursupCertificationLevel } from '../../../../../../../src/certification/results/domain/read-models/parcoursup/ParcoursupCertificationLevel.js';

export const buildParcoursupCertificationLevel = function ({ score = 128, maxReachableLevel = 7 } = {}) {
  return new ParcoursupCertificationLevel({
    score,
    maxReachableLevel,
  });
};
