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
