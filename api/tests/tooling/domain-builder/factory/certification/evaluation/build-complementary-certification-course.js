import { ComplementaryCertificationCourse } from '../../../../../../src/certification/evaluation/domain/models/ComplementaryCertificationCourse.js';

const buildComplementaryCertificationCourse = function ({
  complementaryCertificationKey,
  hasComplementaryReferential,
} = {}) {
  return new ComplementaryCertificationCourse({
    complementaryCertificationKey,
    hasComplementaryReferential,
  });
};

export { buildComplementaryCertificationCourse };
