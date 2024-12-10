import { databaseBuffer } from '../database-buffer.js';

const buildLegalDocumentVersion = function ({
  id = databaseBuffer.getNextId(),
  type,
  service,
  versionAt = new Date(),
} = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'legal-document-versions',
    values: { id, type, service, versionAt },
  });
};

export { buildLegalDocumentVersion };
