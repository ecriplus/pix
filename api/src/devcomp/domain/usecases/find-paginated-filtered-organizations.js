import { PaginatedFilteredOrganizations } from '../models/trainings/PaginatedFilteredOrganizations.js';

async function findPaginatedFilteredOrganizations({
  trainingId,
  targetProfileId,
  filter,
  page,
  organizationRepository,
  targetProfileTrainingRepository,
  targetProfileTrainingOrganizationRepository,
}) {
  const { models, pagination } = await organizationRepository.findPaginatedFilteredByTargetProfile({
    targetProfileId,
    filter,
    page,
  });

  const { id: targetProfileTrainingId } = await targetProfileTrainingRepository.get({ targetProfileId, trainingId });
  const excludedOrganizationIds =
    await targetProfileTrainingOrganizationRepository.getOrganizations(targetProfileTrainingId);

  const paginatedFilteredOrganizations = new PaginatedFilteredOrganizations({
    organizations: models,
    excludedOrganizationIds,
    pagination,
    targetProfileTrainingId,
  });

  return paginatedFilteredOrganizations;
}

export { findPaginatedFilteredOrganizations };
