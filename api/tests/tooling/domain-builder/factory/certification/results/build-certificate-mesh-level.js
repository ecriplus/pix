import { CertificateMeshLevel } from '../../../../../../src/certification/results/domain/models/v3/CertificateMeshLevel.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';

export const buildCertificateMeshLevel = function ({
  reachedMeshIndex = 1,
  certificationFramework = Frameworks.CORE,
} = {}) {
  return new CertificateMeshLevel({
    reachedMeshIndex,
    certificationFramework,
  });
};
