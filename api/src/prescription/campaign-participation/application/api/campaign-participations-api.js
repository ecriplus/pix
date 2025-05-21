import { usecases } from '../../domain/usecases/index.js';

/**
 * @function
 * @name hasCampaignParticipations
 *
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
export const hasCampaignParticipations = async ({ userId }) => {
  return usecases.hasCampaignParticipations({ userId });
};

/**
 * @function
 * @name deleteAllForOrganizationLearner
 *
 * @param {number} organizationLearnerId
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const deleteAllForOrganizationLearner = async function ({ organizationLearnerId, userId }) {
  return usecases.deleteCampaignParticipationsForOrganizationLearner({ organizationLearnerId, userId });
};
