import { databaseBuffer } from '../database-buffer.js';

const buildLegalDocumentVersionUserAcceptance = function ({
  id = databaseBuffer.getNextId(),
  legalDocumentVersionId,
  userId,
  acceptedAt,
} = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'legal-document-version-user-acceptances',
    values: { id, legalDocumentVersionId, userId, acceptedAt },
  });
};

export { buildLegalDocumentVersionUserAcceptance };
