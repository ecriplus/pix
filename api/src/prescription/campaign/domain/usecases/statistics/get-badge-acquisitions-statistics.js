import { UserNotAuthorizedToAccessEntityError } from '../../../../../shared/domain/errors.js';

/**
 *
 * @param {number} userId
 * @param {number} campaignId
 *
 * @param campaignRepository
 * @param campaignParticipationsStatsRepository
 * @param badgeRepository
 * @param badgeAcquisitionRepository
 *
 * @returns {Promise<{badge : Badge, count: number, percentage: number}[]>}
 */
const getBadgeAcquisitionsStatistics = async function ({
  userId,
  campaignId,
  campaignRepository,
  campaignParticipationsStatsRepository,
  badgeRepository,
  badgeAcquisitionRepository,
}) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to the organization that owns the campaign');
  }

  const badges = await badgeRepository.findByCampaignId(campaignId);

  if (!badges) {
    return [];
  }

  const participations = await campaignParticipationsStatsRepository.getAllParticipationsByCampaignId(campaignId);

  const badgesAcquisitions = await badgeAcquisitionRepository.getAcquiredBadgesForCampaignParticipations(
    participations.map(({ id }) => id),
  );

  return badges.map((badge) => {
    const acquiredBadges = badgesAcquisitions.filter((badgeAcquisition) => badgeAcquisition.badgeId === badge.id);

    return {
      badge,
      count: acquiredBadges.length,
      percentage: participations.length ? Math.round((acquiredBadges.length / participations.length) * 100) : 0,
    };
  });
};

export { getBadgeAcquisitionsStatistics };
