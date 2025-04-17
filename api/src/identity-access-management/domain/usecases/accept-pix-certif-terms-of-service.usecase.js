import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

/**
 * @param {{
 *   userId: string,
 *   userRepository: UserRepository
 * }} params
 * @return {Promise<User>}
 */
export const acceptPixCertifTermsOfService = withTransaction(function ({ userId, userRepository }) {
  return userRepository.updatePixCertifTermsOfServiceAcceptedToTrue(userId);
});
