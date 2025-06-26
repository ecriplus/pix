import { ConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/models/ConsolidatedFramework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';

export const buildConsolidatedFramework = function ({
  complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT,
  createdAt = new Date(),
  calibrationId = undefined,
  challenges = [],
} = {}) {
  return new ConsolidatedFramework({
    complementaryCertificationKey,
    createdAt,
    calibrationId,
    challenges,
  });
};
