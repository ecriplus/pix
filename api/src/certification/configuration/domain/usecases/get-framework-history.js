/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').VersionRepository} VersionRepository
 */

/**
 * @param {object} params
 * @param {Scope} params.scope
 * @param {VersionRepository} params.versionRepository
 */
export const getFrameworkHistory = async ({ scope, versionRepository }) => {
  return versionRepository.getFrameworkHistory({ scope });
};
