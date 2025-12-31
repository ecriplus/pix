/**
 * @typedef {import('./index.js').CertificationCenterAccessApi} CertificationCenterAccessApi
 */

import { AllowedCertificationCenterAccess } from '../../domain/read-models/AllowedCertificationCenterAccess.js';

/**
 * @function
 * @name getCertificationCenterAccess
 *
 * @param {object} params
 * @param {Number} params.certificationCenterId
 * @param {CertificationCenterAccessApi} [params.certificationCenterAccessApi]
 * @returns {Promise<AllowedCertificationCenterAccess>}
 */
export const getCertificationCenterAccess = async ({ certificationCenterId, certificationCenterAccessApi }) => {
  const dto = await certificationCenterAccessApi.getCertificationCenterAccess({ certificationCenterId });

  return _toDomain(dto);
};

/**
 * @param {object} params
 */
const _toDomain = (dto) => {
  return new AllowedCertificationCenterAccess(dto);
};
