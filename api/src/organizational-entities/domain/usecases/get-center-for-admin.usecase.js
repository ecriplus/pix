/**
 * @typedef {import('../../../certification/enrolment/domain/usecases/index.js').CenterRepository} CenterRepository
 * @typedef {import('../models/CenterForAdmin.js').CenterForAdmin} CenterForAdmin
 */

import { CenterForAdminFactory } from '../models/factories/CenterForAdminFactory.js';

/**
 * @param {Object} params
 * @param {CertificationCenterRepository} params.certificationCenterRepository
 * @returns {CenterForAdmin}
 */
const getCenterForAdmin = async function ({ id, certificationCenterRepository, dataProtectionOfficerRepository }) {
  const center = await certificationCenterRepository.getById({ id });
  const dataProtectionOfficer = await dataProtectionOfficerRepository.get({
    certificationCenterId: id,
  });
  return CenterForAdminFactory.fromCenterAndDataProtectionOfficer({
    center,
    dataProtectionOfficer,
  });
};

export { getCenterForAdmin };
