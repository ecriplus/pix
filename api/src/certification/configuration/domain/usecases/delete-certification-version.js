/**
 * @typedef {import ('./index.js').VersionRepository} VersionRepository
 */

import { CertificationVersionForbiddenDeletionError } from "../errors.js";

/**
 * @param {object} params
 * @param {number} params.certificationVersionId
 * @param {VersionRepository} params.versionRepository
 */

export async function deleteCertificationVersion({ certificationVersionId, versionRepository }) {
  if (await versionRepository.isDraft(certificationVersionId)) {
    await versionRepository.deleteDraft(certificationVersionId);
    return;
  }
  throw new CertificationVersionForbiddenDeletionError();
}
