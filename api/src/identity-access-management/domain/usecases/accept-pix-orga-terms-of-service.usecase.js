/**
 * @param {{
 *   userId: string,
 *   legalDocumentApiRepository: legalDocumentApiRepository
 * }} params
 * @return {Promise<void>}
 */
export const acceptPixOrgaTermsOfService = function ({ userId, legalDocumentApiRepository }) {
  return legalDocumentApiRepository.acceptPixOrgaTos({ userId });
};
