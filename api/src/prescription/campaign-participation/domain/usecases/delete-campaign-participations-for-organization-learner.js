import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const deleteCampaignParticipationsForOrganizationLearner = withTransaction(async function ({
  userId,
  organizationLearnerId,
  featureToggles,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
}) {
  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  const campaignParticipations =
    await campaignParticipationRepository.getAllCampaignParticipationsForOrganizationLearner({
      organizationLearnerId,
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

export { deleteCampaignParticipationsForOrganizationLearner };
