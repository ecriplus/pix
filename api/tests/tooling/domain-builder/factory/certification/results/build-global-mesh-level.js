import { GlobalCertificationLevel } from '../../../../../../src/certification/results/domain/models/v3/GlobalCertificationLevel.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';

export const buildGlobalCertificationLevel = function ({
  reachedMeshIndex = 1,
  certificationFramework = Frameworks.CORE,
} = {}) {
  return new GlobalCertificationLevel({
    reachedMeshIndex,
    certificationFramework,
  });
};
