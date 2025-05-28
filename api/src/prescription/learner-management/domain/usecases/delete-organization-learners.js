import { OrganizationLearnerList } from '../models/OrganizationLearnerList.js';

const deleteOrganizationLearners = async function ({
  organizationLearnerIds,
  userId,
  organizationId,
  organizationLearnerRepository,
  featureToggles,
  campaignParticipationRepositoryfromBC,
  badgeAcquisitionRepository,
}) {
  const organizationLearnersFromOrganization =
    await organizationLearnerRepository.findOrganizationLearnersByOrganizationId({
      organizationId,
    });

  const organizationLearnerList = new OrganizationLearnerList({
    organizationId,
    organizationLearners: organizationLearnersFromOrganization,
  });

  const organizationLearnersToDelete = organizationLearnerList.getDeletableOrganizationLearners(
    organizationLearnerIds,
    userId,
  );

  const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

  for (const organizationLearner of organizationLearnersToDelete) {
    organizationLearner.delete(userId, isAnonymizationWithDeletionEnabled);
    await organizationLearnerRepository.remove(organizationLearner.dataToUpdateOnDeletion);

    const campaignParticipations =
      await campaignParticipationRepositoryfromBC.getAllCampaignParticipationsForOrganizationLearner({
        organizationLearnerId: organizationLearner.id,
      });

    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId, isAnonymizationWithDeletionEnabled);
      await campaignParticipationRepositoryfromBC.remove(campaignParticipation.dataToUpdateOnDeletion);
    }

    if (isAnonymizationWithDeletionEnabled) {
      const campaignParticipationIds = campaignParticipations.map(({ id }) => id);
      await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
        campaignParticipationIds,
      );
    }
  }
};

export { deleteOrganizationLearners };
