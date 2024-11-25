import * as userTeamsApi from '../../../team/application/api/user-teams.js';

/**
 * Get user teams info.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.userId - The ID of the user.
 * @param {Object} [params.dependencies] - The dependencies.
 * @param {Object} [params.dependencies.userTeamsApi] - The user teams API.
 * @returns {Promise<UserTeamsInfo>} The user teams info.
 */
const getUserTeamsInfo = async ({ userId, dependencies = { userTeamsApi } }) => {
  return dependencies.userTeamsApi.getUserTeamsInfo(userId);
};

export { getUserTeamsInfo };
