import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const findOrganizationLearnersWithOrganizationByIds = withTransaction(async function ({
  organizationLearnerIds,
  organizationId,
  organizationRepository,
  libOrganizationLearnerRepository,
  tagRepository,
}) {
  const organizationLearners = await libOrganizationLearnerRepository.findByIds({ ids: organizationLearnerIds });
  const organization = await organizationRepository.get(organizationId);
  const tags = await tagRepository.findByIds(organization.tags.map((tag) => tag.id));
  const tagNames = tags.map((tag) => tag.name);

  return organizationLearners.map((organizationLearner) => ({
    organizationLearner,
    organization: {
      id: organization.id,
      isManagingStudents: organization.isManagingStudents,
      tags: tagNames,
      type: organization.type,
    },
  }));
});

export { findOrganizationLearnersWithOrganizationByIds };
