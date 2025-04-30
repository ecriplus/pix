import { ArchiveCertificationCentersInBatchError } from '../errors.js';

/**
 * @param {Object} params
 * @param {Array} params.certificationCenterIds
 * @param {Number} params.userId
 * @param {Object} params.certificationCenterForAdminRepository
 * @param {Object} params.certificationCenterApiRepository
 */
export const archiveCertificationCentersInBatch = async function ({
  certificationCenterIds,
  userId,
  certificationCenterForAdminRepository,
  certificationCenterApiRepository,
}) {
  // we don't use a transaction here not to rollback lines 0 to N-1 in case of an error on line N
  const archiveDate = new Date();

  for (const [index, certificationCenterId] of certificationCenterIds.entries()) {
    try {
      await certificationCenterApiRepository.archiveCertificationCenterData({
        certificationCenterId,
        archivedBy: userId,
        archiveDate,
      });
      await certificationCenterForAdminRepository.archive({ certificationCenterId, archivedBy: userId, archiveDate });
    } catch {
      throw new ArchiveCertificationCentersInBatchError({
        meta: {
          currentLine: index + 1,
          totalLines: certificationCenterIds.length,
        },
      });
    }
  }
};
