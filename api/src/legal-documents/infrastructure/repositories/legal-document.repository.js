import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { LegalDocument } from '../../domain/models/LegalDocument.js';

/**
 * Retrieves the latest version of a legal document by type and service.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.type - The type of the legal document.
 * @param {string} params.service - The service associated with the legal document.
 * @returns {Promise<LegalDocument|null>} The latest version of the legal document or null if not found.
 */
const findLastVersionByTypeAndService = async ({ type, service }) => {
  const knexConnection = DomainTransaction.getConnection();
  const documentVersionDto = await knexConnection('legal-document-versions')
    .where({ type, service })
    .orderBy('versionAt', 'desc')
    .first();

  if (!documentVersionDto) return null;

  return new LegalDocument(documentVersionDto);
};

export { findLastVersionByTypeAndService };
