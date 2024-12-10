import { LegalDocument } from '../models/LegalDocument.js';

const { TOS } = LegalDocument.TYPES;
const { PIX_ORGA } = LegalDocument.SERVICES;

/**
 * Accepts a legal document by user ID.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.type - The type of the legal document.
 * @param {string} params.service - The service of the legal document.
 * @param {string} params.userId - The ID of the user.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const acceptLegalDocumentByUserId = async ({
  type,
  service,
  userId,
  userRepository,
  legalDocumentRepository,
  userAcceptanceRepository,
  logger,
}) => {
  // legacy document acceptance
  if (type === TOS && service === PIX_ORGA) {
    await userRepository.setPixOrgaCguByUserId(userId);
  }

  // new document acceptance
  const legalDocument = await legalDocumentRepository.findLastVersionByTypeAndService({ type, service });
  if (!legalDocument) {
    logger.warn(`No legal document found for type: ${type} and service: ${service}`);
    return;
  }

  await userAcceptanceRepository.create({ userId, legalDocumentVersionId: legalDocument.id });
};

export { acceptLegalDocumentByUserId };
