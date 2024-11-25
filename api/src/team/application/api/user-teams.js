import { usecases } from '../../domain/usecases/index.js';
import { UserTeamsInfo } from './models/user-teams-info.js';

/**
 * @module UserTeamsApi
 */

/**
 * Retrieves information user's teams.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<UserTeamsInfo>} A promise that resolves to an instance of UserTeamsInfo.
 * @throws {TypeError} preconditions failed
 */
export async function getUserTeamsInfo(userId) {
  if (!userId) {
    throw new TypeError('userId is required');
  }

  const userTeamsInfo = await usecases.getUserTeamsInfo({ userId });
  return new UserTeamsInfo(userTeamsInfo);
}
