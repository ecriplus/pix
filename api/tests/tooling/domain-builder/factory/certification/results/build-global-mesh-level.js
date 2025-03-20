import { GlobalCertificationLevel } from '../../../../../../src/certification/shared/domain/models/GlobalCertificationLevel.js';

export const buildGlobalCertificationLevel = function ({ score = 1 } = {}) {
  return new GlobalCertificationLevel({
    score,
  });
};
