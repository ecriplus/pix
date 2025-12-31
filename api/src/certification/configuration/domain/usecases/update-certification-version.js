/**
 * @typedef {import('../../domain/models/Version.js').Version} Version
 * @typedef {import ('./index.js').VersionsRepository} VersionsRepository
 */

/**
 * @param {object} params
 * @param {Version} params.updatedVersion
 * @param {VersionsRepository} params.versionsRepository
 * @returns {Promise<Version>}
 */
export const updateCertificationVersion = async ({ updatedVersion, versionsRepository }) => {
  return versionsRepository.update({ version: updatedVersion });
};
