/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').VersionsRepository} VersionsRepository
 */

/**
 * @param {object} params
 * @param {scope} params.scope
 * @param {VersionsRepository} params.versionsRepository
 */
export const getFrameworkHistory = async ({ scope, versionsRepository }) => {
  return versionsRepository.getFrameworkHistory({ scope });
};
