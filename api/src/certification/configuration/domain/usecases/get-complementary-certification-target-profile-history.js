/**
 * @typedef {import ('../../domain/usecases/index.js').TargetProfileHistoryRepository} TargetProfileHistoryRepository
 * @typedef {import ('../../domain/usecases/index.js').ComplementaryCertificationForTargetProfileAttachmentRepository} ComplementaryCertificationForTargetProfileAttachmentRepository
 */
import { ComplementaryCertificationTargetProfileHistory } from '../models/ComplementaryCertificationTargetProfileHistory.js';

/**
 * @param {Object} params
 * @param {string} params.complementaryCertificationKey
 * @param {TargetProfileHistoryRepository} params.targetProfileHistoryRepository
 * @param {ComplementaryCertificationForTargetProfileAttachmentRepository} params.complementaryCertificationForTargetProfileAttachmentRepository
 *
 * @returns {Promise<ComplementaryCertificationTargetProfileHistory>} all target profiles than were applicable for this complementary certification
 */
const getComplementaryCertificationTargetProfileHistory = async function ({
  complementaryCertificationKey,
  targetProfileHistoryRepository,
  complementaryCertificationForTargetProfileAttachmentRepository,
}) {
  const complementaryCertification = await complementaryCertificationForTargetProfileAttachmentRepository.getByKey({
    complementaryCertificationKey,
  });

  const complementaryCertificationId = complementaryCertification.id;

  const currentsTargetProfileHistoryWithBadgesByComplementaryCertification =
    await targetProfileHistoryRepository.getCurrentTargetProfilesHistoryWithBadgesByComplementaryCertificationId({
      complementaryCertificationId,
    });

  const detachedTargetProfileHistoryByComplementaryCertification =
    await targetProfileHistoryRepository.getDetachedTargetProfilesHistoryByComplementaryCertificationId({
      complementaryCertificationId,
    });

  return new ComplementaryCertificationTargetProfileHistory({
    ...complementaryCertification,
    targetProfilesHistory: [
      ...currentsTargetProfileHistoryWithBadgesByComplementaryCertification,
      ...detachedTargetProfileHistoryByComplementaryCertification,
    ],
  });
};

export { getComplementaryCertificationTargetProfileHistory };
