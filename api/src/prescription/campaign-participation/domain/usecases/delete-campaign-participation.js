import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const deleteCampaignParticipation = withTransaction(async function ({
  userId,
  campaignId,
  campaignParticipationId,
  featureToggles,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
  assessmentRepository,
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
  if (isAnonymizationWithDeletionEnabled) {
    const campaignParticipationIds = campaignParticipations.map(({ id }) => id);
    await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
      campaignParticipationIds,
    );
    const assessments = await assessmentRepository.getByCampaignParticipationIds(campaignParticipationIds);
    for (const assessment of assessments) {
      assessment.detachCampaignParticipation();
      await assessmentRepository.updateCampaignParticipationId(assessment);
    }
  }
});

export { deleteCampaignParticipation };
