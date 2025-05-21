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

  const organizationLearnerIdsToDelete =
    organizationLearnerList.getDeletableOrganizationLearners(organizationLearnerIds);

  await campaignParticipationRepository.removeByOrganizationLearnerIds({
    organizationLearnerIds: organizationLearnerIdsToDelete,
    userId,
  });

  await organizationLearnerRepository.removeByIds({ organizationLearnerIds: organizationLearnerIdsToDelete, userId });
};

export { deleteOrganizationLearners };
