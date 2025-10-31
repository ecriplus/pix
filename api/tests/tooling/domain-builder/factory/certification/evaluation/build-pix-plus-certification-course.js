import { PixPlusCertificationCourse } from '../../../../../../src/certification/evaluation/domain/models/PixPlusCertificationCourse.js';

const buildPixPlusCertificationCourse = function ({ id = 1 } = {}) {
  return new PixPlusCertificationCourse({
    id,
  });
};

export { buildPixPlusCertificationCourse };
