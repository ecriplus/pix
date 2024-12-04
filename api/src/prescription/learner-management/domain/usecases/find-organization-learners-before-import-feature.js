/**
 * @typedef {import('./index.js').OrganizationLearnerRepository} OrganizationLearnerRepository
 */

/**
 * @param{number} organizationId
 * @param{OrganizationLearnerRepository} organizationLearnerRepository
 * @returns {Promise<number[]>}
 */
const findOrganizationLearnersBeforeImportFeature = async function ({ organizationId, organizationLearnerRepository }) {
  return organizationLearnerRepository.findOrganizationLearnerIdsBeforeImportFeatureFromOrganizationId({
    organizationId,
  });
};

export { findOrganizationLearnersBeforeImportFeature };
