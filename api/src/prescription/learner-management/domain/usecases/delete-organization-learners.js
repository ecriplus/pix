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

  const organizationLearnersToDelete = organizationLearnerList.getDeletableOrganizationLearners(organizationLearnerIds);

  for (const organizationLearner of organizationLearnersToDelete) {
    await campaignParticipationRepository.removeByOrganizationLearnerId({
      organizationLearnerId: organizationLearner.id,
      userId,
    });
  }

  await organizationLearnerRepository.removeByIds({
    organizationLearnerIds: organizationLearnersToDelete.map(({ id }) => id),
    userId,
  });
};

export { deleteOrganizationLearners };
