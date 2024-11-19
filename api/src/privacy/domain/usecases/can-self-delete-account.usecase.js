import { config } from '../../../shared/config.js';

/**
 * Determines if a user can self-delete their account.
 *
 * @param {Object} params - The parameters for the use case.
 * @param {number} params.userId - The ID of the user.
 * @param {Object} [params.featureToggles] - The feature toggles configuration.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if self-account deletion is enabled.
 */
const canSelfDeleteAccount = async ({ featureToggles = config.featureToggles }) => {
  const { isSelfAccountDeletionEnabled } = featureToggles;

  if (!isSelfAccountDeletionEnabled) return false;

  return true;
};

export { canSelfDeleteAccount };
