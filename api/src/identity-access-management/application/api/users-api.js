import { usecases } from '../../domain/usecases/index.js';
import { UserDTO } from './models/UserDTO.js';
/**
 * @module UserApi
 */

/**
 * @function
 * @name markNewDashboardInfoAsSeen
 *
 * @param {Object} params
 * @param {Number} params.userId
 * @returns {Promise}
 */
export const markNewDashboardInfoAsSeen = async ({ userId }) => {
  return usecases.markUserHasSeenNewDashboardInfo({ userId });
};

/**
 * @function
 * @name markAssessmentInstructionsInfoAsSeen
 *
 * @param {Object} params
 * @param {Number} params.userId
 * @returns {Promise}
 */
export const markAssessmentInstructionsInfoAsSeen = async ({ userId }) => {
  return usecases.markAssessmentInstructionsInfoAsSeen({ userId });
};

export const getUserDetailsByUserIds = async ({ userIds }) => {
  const users = await usecases.getUserDetailsByUserIds({ userIds });
  return users.map((user) => new UserDTO(user));
};
