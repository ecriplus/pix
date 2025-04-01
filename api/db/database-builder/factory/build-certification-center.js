import { databaseBuffer } from '../database-buffer.js';

const buildCertificationCenter = function ({
  id = databaseBuffer.getNextId(),
  name = 'some name',
  type = 'SUP',
  externalId = 'EX123',
  createdAt = new Date('2020-01-01'),
  updatedAt,
  isV3Pilot = false,
  isScoBlockedAccessWhitelist = false,
  archivedAt = null,
  archivedBy = null,
} = {}) {
  const values = {
    id,
    name,
    type,
    externalId,
    createdAt,
    updatedAt,
    isV3Pilot,
    isScoBlockedAccessWhitelist,
    archivedAt,
    archivedBy,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-centers',
    values,
  });
};

export { buildCertificationCenter };
