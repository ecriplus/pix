import { usecases } from '../../domain/usecases/index.js';

/**
 * Anonymizes everything related to the user.
 *
 * @param{string} params.userId
 * @param{string} params.anonymizedByUserId
 * @param{string} params.anonymizedByUserRole
 * @param{string} params.client
 * @returns {Promise<void>}
 */
const anonymizeUser = async ({ userId, anonymizedByUserId, anonymizedByUserRole, client }) => {
  return usecases.anonymizeUser({ userId, anonymizedByUserId, anonymizedByUserRole, client });
};

/**
 * Determines if a user can self-delete their account.
 *
 * @param {Object} params - The parameters for the function.
 * @param {number} params.userId - The ID of the user.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the user can self-delete their account.
 */
const canSelfDeleteAccount = async ({ userId }) => {
  return usecases.canSelfDeleteAccount({ userId });
};

export { anonymizeUser, canSelfDeleteAccount };
