import * as campaignParticipationsApi from '../../../prescription/campaign-participation/application/api/campaign-participations-api.js';

/**
 * Checks if the user has been a candidate.
 *
 * @param {Object} params - The parameters.
 * @param {string} params.userId - The ID of the user.
 * @param {Object} [params.dependencies] - The dependencies.
 * @param {Object} [params.dependencies.candidatesApi] - The candidates API.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the user has been a candidate.
 */
const hasCampaignParticipations = async ({ userId, dependencies = { campaignParticipationsApi } }) => {
  return dependencies.campaignParticipationsApi.hasCampaignParticipations({ userId });
};

export { hasCampaignParticipations };
