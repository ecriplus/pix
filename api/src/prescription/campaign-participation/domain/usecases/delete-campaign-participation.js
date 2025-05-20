import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const deleteCampaignParticipation = withTransaction(async function ({
  userId,
  campaignId,
  campaignParticipationId,
  featureToggles,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
}) {
  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  const campaignParticipations =
    await campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
      campaignId,
      campaignParticipationId,
    });

  for (const campaignParticipation of campaignParticipations) {
    campaignParticipation.delete(userId, isAnonymizationWithDeletionEnabled);
    await campaignParticipationRepository.remove(campaignParticipation.dataToUpdateOnDeletion);
  }

  const campaignParticipationIds = campaignParticipations.map(({ id }) => id);
  await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
    campaignParticipationIds,
  );
});

export { deleteCampaignParticipation };
