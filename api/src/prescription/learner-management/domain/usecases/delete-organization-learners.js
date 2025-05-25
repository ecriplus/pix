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

  for (const organizationLearner of organizationLearnersToDelete) {
    organizationLearner.delete(userId);
    await organizationLearnerRepository.remove(organizationLearner);

    const isAnonymizationWithDeletionEnabled = await featureToggles.get('isAnonymizationWithDeletionEnabled');

    const campaignParticipations =
      await campaignParticipationRepositoryfromBC.getAllCampaignParticipationsForOrganizationLearner({
        organizationLearnerId: organizationLearner.id,
      });

    for (const campaignParticipation of campaignParticipations) {
      campaignParticipation.delete(userId, isAnonymizationWithDeletionEnabled);
      await campaignParticipationRepositoryfromBC.remove(campaignParticipation.dataToUpdateOnDeletion);
    }

    const campaignParticipationIds = campaignParticipations.map(({ id }) => id);
    await badgeAcquisitionRepository.deleteUserIdOnNonCertifiableBadgesForCampaignParticipations(
      campaignParticipationIds,
    );
  }
};

export { deleteOrganizationLearners };
