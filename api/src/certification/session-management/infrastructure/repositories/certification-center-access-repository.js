/**
 * @typedef {import('./index.js').CertificationCenterAccessApi} CertificationCenterAccessApi
 */

import { AllowedCertificationCenterAccess } from '../../domain/read-models/AllowedCertificationCenterAccess.js';

/**
 * @function
 * @name getCertificationCenterAccess
 *
 * @param {Object} params
 * @param {Number} params.certificationCenterId
 * @param {CertificationCenterAccessApi} [params.certificationCenterAccessApi]
 * @returns {Promise<AllowedCertificationCenterAccess>}
 */
export const getCertificationCenterAccess = async ({ certificationCenterId, certificationCenterAccessApi }) => {
  const dto = await certificationCenterAccessApi.getCertificationCenterAccess({ certificationCenterId });

  return _toDomain(dto);
};

/**
 * @param {Object} params
 * @param {boolean} params.isAccessBlockedUntilDate
 * @param {string|null} params.pixCertifBlockedAccessUntilDate
 */
const _toDomain = ({ isAccessBlockedUntilDate, pixCertifBlockedAccessUntilDate }) => {
  return new AllowedCertificationCenterAccess({
    isAccessBlockedUntilDate,
    pixCertifBlockedAccessUntilDate,
  });
};
