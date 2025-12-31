/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').VersionsRepository} VersionsRepository
 */

/**
 * @param {object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {VersionsRepository} params.versionsRepository
 */
export const getFrameworkHistory = async ({ complementaryCertificationKey, versionsRepository }) => {
  return versionsRepository.getFrameworkHistory({ scope: complementaryCertificationKey });
};
