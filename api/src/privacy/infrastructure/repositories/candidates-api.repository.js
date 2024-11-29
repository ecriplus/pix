import * as candidatesApi from '../../../certification/enrolment/application/api/candidates-api.js';

/**
 * Checks if the user has been a candidate.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.userId - The ID of the user.
 * @param {Object} [params.dependencies] - The dependencies.
 * @param {Object} [params.dependencies.candidatesApi] - The candidates API.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the user has been a candidate.
 */
const hasBeenCandidate = async ({ userId, dependencies = { candidatesApi } }) => {
  return dependencies.candidatesApi.hasBeenCandidate({ userId });
};

export { hasBeenCandidate };
