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

  organizationLearnerList.canDeleteOrganizationLearners(organizationLearnerIds, userId);

  await campaignParticipationRepository.removeByOrganizationLearnerIds({
    organizationLearnerIds,
    userId,
  });

  await organizationLearnerRepository.removeByIds({ organizationLearnerIds, userId });
};

export { deleteOrganizationLearners };
