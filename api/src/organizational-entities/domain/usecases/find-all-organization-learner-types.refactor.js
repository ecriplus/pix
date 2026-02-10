/**
 * @function
 * @returns {Promise<Array<OrganizationLearnerType>>}
 */
const findAllOrganizationLearnerTypes = async function ({ organizationLearnerTypeRepository }) {
  return organizationLearnerTypeRepository.findAll();
};

export { findAllOrganizationLearnerTypes };
