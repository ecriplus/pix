import { usecases } from '../../domain/usecases/index.js';

/**
 * Accept legal document by user id.
 *
 * @param{string} params.service
 * @param{string} params.type
 * @param{string} params.userId
 *
 * @returns {Promise<void>}
 */
const acceptLegalDocumentByUserId = async ({ type, service, userId }) => {
  return usecases.acceptLegalDocumentByUserId({ type, service, userId });
};

export { acceptLegalDocumentByUserId };
