import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

/**
 * Creates a new user acceptance record for a legal document version.
 *
 * @param {Object} params - The parameters for creating the user acceptance.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.legalDocumentVersionId - The ID of the legal document version.
 * @returns {Promise<void>} A promise that resolves when the record is created.
 */
const create = async ({ userId, legalDocumentVersionId }) => {
  const knexConnection = DomainTransaction.getConnection();
  await knexConnection('legal-document-version-user-acceptances').insert({ userId, legalDocumentVersionId });
};

export { create };
