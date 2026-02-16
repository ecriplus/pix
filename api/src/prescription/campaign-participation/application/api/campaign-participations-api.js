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

export const getCampaignParticipationsByLearnerIdAndCampaignId = async ({ organizationLearnerId, campaignId }) => {
  return usecases.getCampaignParticipationsForOrganizationLearner({
    organizationLearnerId,
    campaignId,
  });
};

export const deleteCampaignParticipations = async ({
  userId,
  campaignParticipationIds,
  campaignId,
  keepPreviousDeletion,
  userRole,
  client,
}) => {
  for (const campaignParticipationId of campaignParticipationIds) {
    await usecases.deleteCampaignParticipation({
      userId,
      campaignId,
      campaignParticipationId,
      userRole,
      client,
      keepPreviousDeleted: keepPreviousDeletion,
    });
  }
};
