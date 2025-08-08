/**
 * @typedef {import ('./index.js').PlacementProfileService} PlacementProfileService
 */

import { UserNotAuthorizedToCertifyError } from '../../../../shared/domain/errors.js';

/**
 * @param {Object} params
 * @param {PlacementProfileService} params.placementProfileService
 *
 * @returns {Promise<void>} if candidate is deemed eligible
 * @throws {UserNotAuthorizedToCertifyError} candidate is not certifiable for CORE
 */
export async function verifyCandidateCertificability({ candidate, placementProfileService }) {
  const placementProfile = await placementProfileService.getPlacementProfile({
    userId: candidate.userId,
    limitDate: candidate.reconciledAt,
  });

  if (!placementProfile.isCertifiable()) {
    throw new UserNotAuthorizedToCertifyError();
  }
}
