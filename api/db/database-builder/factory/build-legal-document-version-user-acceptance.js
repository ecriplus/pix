import { databaseBuffer } from '../database-buffer.js';

const buildLegalDocumentVersionUserAcceptance = function ({ legalDocumentVersionId, userId, acceptedAt } = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'legal-document-version-user-acceptances',
    values: { legalDocumentVersionId, userId, acceptedAt },
  });
};

export { buildLegalDocumentVersionUserAcceptance };
