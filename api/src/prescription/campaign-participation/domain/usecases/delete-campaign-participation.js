import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const deleteCampaignParticipation = withTransaction(async function ({
  userId,
  campaignId,
  campaignParticipationId,
  featureToggles,
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
});

export { deleteCampaignParticipation };
