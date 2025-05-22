import { OrganizationLearnerList } from '../models/OrganizationLearnerList.js';

const deleteOrganizationLearners = async function ({
  organizationLearnerIds,
  userId,
  organizationId,
  organizationLearnerRepository,
  campaignParticipationRepository,
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
    await campaignParticipationRepository.removeByOrganizationLearnerId({
      organizationLearnerId: organizationLearner.id,
      userId,
    });
    organizationLearner.delete(userId);
    await organizationLearnerRepository.remove(organizationLearner);
  }
};

export { deleteOrganizationLearners };
