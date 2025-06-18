import { ComplementaryCertificationForTargetProfileAttachment } from '../../../../src/certification/complementary-certification/domain/models/ComplementaryCertificationForTargetProfileAttachment.js';

const buildComplementaryCertificationForTargetProfileAttachment = function ({
  id = 1,
  key = 'Complementary certification key',
  label = 'Complementary certification name',
  hasExternalJury = true,
} = {}) {
  return new ComplementaryCertificationForTargetProfileAttachment({
    id,
    key,
    label,
    hasExternalJury,
  });
};

export { buildComplementaryCertificationForTargetProfileAttachment };
