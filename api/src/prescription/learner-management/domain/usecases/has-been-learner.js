/**
 * @typedef {import('./index.js').OrganizationLearnerRepository} OrganizationLearnerRepository
 */

/**
 * @param{number} userId
 * @param{OrganizationLearnerRepository} organizationLearnerRepository
 * @returns {Promise<boolean>}
 */
const hasBeenLearner = async function ({ userId, organizationLearnerRepository }) {
  const countOrganizationLearner = await organizationLearnerRepository.countByUserId(userId);

  return countOrganizationLearner > 0;
};

export { hasBeenLearner };
