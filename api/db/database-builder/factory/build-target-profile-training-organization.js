import { databaseBuffer } from '../database-buffer.js';

const buildTargetProfileTrainingOrganization = function ({
  id = databaseBuffer.getNextId(),
  targetProfileTrainingId,
  organizationId,
} = {}) {
  const values = {
    id,
    targetProfileTrainingId,
    organizationId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'target-profile-training-organizations',
    values,
  });
};

export { buildTargetProfileTrainingOrganization };
