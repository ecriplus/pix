import { LegalDocumentInvalidDateError } from '../errors.js';
import { LegalDocumentService } from '../models/LegalDocumentService.js';
import { LegalDocumentType } from '../models/LegalDocumentType.js';

/**
 * Creates a new legal document.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.type - The type of the legal document.
 * @param {string} params.service - The service of the legal document.
 * @param {string} params.versionAt - Version date of the new legal document.
 * @returns {Promise<LegalDocument>} A promise that resolves the new legal document.
 */
const createLegalDocument = async ({ type, service, versionAt, legalDocumentRepository }) => {
  LegalDocumentType.assert(type);
  LegalDocumentService.assert(service);

  const lastDocument = await legalDocumentRepository.findLastVersionByTypeAndService({ type, service });

  if (lastDocument && lastDocument.versionAt >= versionAt) {
    throw new LegalDocumentInvalidDateError();
  }

  return legalDocumentRepository.create({ type, service, versionAt });
};

export { createLegalDocument };
