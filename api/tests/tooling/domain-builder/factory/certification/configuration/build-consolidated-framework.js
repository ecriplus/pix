import { ConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/models/ConsolidatedFramework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';

export const buildConsolidatedFramework = function ({
  id = 1,
  complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT,
  createdAt = new Date(),
  tubeIds = ['tube1'],
} = {}) {
  return new ConsolidatedFramework({
    id,
    complementaryCertificationKey,
    createdAt,
    tubeIds,
  });
};
