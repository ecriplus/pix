import { datamartBuffer } from '../datamart-buffer.js';

const buildTargetProfileCourseDuration = function ({ targetProfileId, median, quantile_75, quantile_95 } = {}) {
  const values = { targetProfileId, median, quantile_75, quantile_95 };

  datamartBuffer.pushInsertable({
    tableName: 'target_profiles_course_duration',
    values,
  });
};

export { buildTargetProfileCourseDuration };
