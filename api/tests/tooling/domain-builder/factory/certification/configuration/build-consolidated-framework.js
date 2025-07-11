import { ConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/models/ConsolidatedFramework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';

export const buildConsolidatedFramework = function ({
  complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT,
  version = '20240607080000',
  calibrationId = undefined,
  challenges = [],
} = {}) {
  return new ConsolidatedFramework({
    complementaryCertificationKey,
    version,
    calibrationId,
    challenges,
  });
};
