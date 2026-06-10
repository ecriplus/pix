/**
 * @param {{
 *   userId: string,
 *   userRepository: UserRepository
 * }} params
 * @return {Promise<void>}
 */
export const acceptPixAppTermsOfService = async function ({ userId, legalDocumentApiRepository }) {
  await legalDocumentApiRepository.acceptPixAppTos({ userId });
};
