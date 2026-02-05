import { databaseBuffer } from '../database-buffer.js';

const buildOrganizationLearnerType = function ({ id = databaseBuffer.getNextId(), name = `Type ${id}` } = {}) {
  const values = {
    id,
    name,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'organization_learner_types',
    values,
  });
};

export { buildOrganizationLearnerType };
