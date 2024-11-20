import { ForbiddenAccess } from '../../../shared/domain/errors.js';

/**
 * @typedef {import('../../infrastructure/repositories/privacy-users-api.repository.js')} PrivacyUsersApiRepository
 */

/**
 * @param{object} params
 * @param{number} params.userId
 * @param{PrivacyUsersApiRepository} privacyUsersApiRepository
 * @returns {Promise<boolean>}
 */
export const selfDeleteUserAccount = async function ({ userId, privacyUsersApiRepository }) {
  const canSelfDeleteAccount = await privacyUsersApiRepository.canSelfDeleteAccount({ userId });

  if (!canSelfDeleteAccount) {
    throw new ForbiddenAccess();
  }

  const anonymizedByUserId = userId;
  const anonymizedByUserRole = 'USER';
  const client = 'PIX_APP';
  await privacyUsersApiRepository.anonymizeUser({ userId, anonymizedByUserId, anonymizedByUserRole, client });
};
