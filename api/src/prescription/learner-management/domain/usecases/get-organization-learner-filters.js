const getOrganizationLearnerFilters = async function ({ organizationId, organizationLearnerFilterRepository }) {
  return organizationLearnerFilterRepository.findByOrganizationId(organizationId);
};

export { getOrganizationLearnerFilters };
