import { AuthenticationMethodNotFoundError } from '../../../shared/domain/errors.js';

/**
 * Revokes access for a list of users.
 *
 * @param {object} params - The params object.
 * @param {string[]} params.userIds - The IDs of the users whose access should be revoked.
 */
export const revokeAccessForUsers = async function ({
  userIds,
  revokedUserAccessRepository,
  refreshTokenRepository,
  authenticationMethodRepository,
}) {
  for (const userId of userIds) {
    // Revoke user AccessToken
    await revokedUserAccessRepository.saveForUser({ userId, revokeUntil: new Date() });

    // Revoke user RefreshToken
    await refreshTokenRepository.revokeAllByUserId({ userId });

    // Revoke current user password
    try {
      await authenticationMethodRepository.updatePassword({ userId, hashedPassword: '[revoked]' });
    } catch (error) {
      if (!(error instanceof AuthenticationMethodNotFoundError)) throw error;
    }
  }
};
