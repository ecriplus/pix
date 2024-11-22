import { usecases } from '../../domain/usecases/index.js';

/**
 * Check if user has been a learner of an organization
 *
 * @param {object} params
 * @param {number} params.userId - The ID of the user to check
 * @returns {Promise<boolean>}
 * @throws TypeError - Throw when params.userId is not defined
 */
export const hasBeenLearner = async ({ userId }) => {
  if (!userId) {
    throw new TypeError('userId is required');
  }

  const isLearner = await usecases.hasBeenLearner({ userId });

  return isLearner;
};
