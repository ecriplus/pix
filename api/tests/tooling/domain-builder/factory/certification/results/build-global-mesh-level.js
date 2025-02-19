import { GlobalCertificationLevel } from '../../../../../../src/certification/shared/domain/models/GlobalCertificationLevel.js';

export const buildGlobalCertificationLevel = function ({ meshLevel = 1 } = {}) {
  return new GlobalCertificationLevel({
    meshLevel,
  });
};
