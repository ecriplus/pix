/**
 * @typedef {import('../../domain/models/Version.js').Version} Version
 * @typedef {import ('./index.js').VersionRepository} VersionRepository
 * @typedef {import('../../../shared/domain/models/Scopes.js').SCOPES} SCOPES
 */

import { NotFoundError } from '../../../../shared/domain/errors.js';

/**
 * @param {object} params
 * @param {SCOPES} params.scope
 * @param {VersionRepository} params.versionRepository
 * @returns {Promise<Version>}
 */
export const getActiveVersionByScope = async ({ scope, versionRepository }) => {
  const version = await versionRepository.findActiveByScope({ scope });

  if (!version) {
    throw new NotFoundError(`No active certification version found for scope: ${scope}`);
  }

  return version;
};
