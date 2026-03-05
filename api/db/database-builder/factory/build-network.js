import { databaseBuffer } from '../database-buffer.js';

const buildNetwork = function ({
  id = databaseBuffer.getNextId(),
  name = 'Network',
  createdAt = new Date(),
  updatedAt,
} = {}) {
  const values = {
    id,
    name,
    created_at: createdAt,
    updated_at: updatedAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'networks',
    values,
  });
};

export { buildNetwork };
