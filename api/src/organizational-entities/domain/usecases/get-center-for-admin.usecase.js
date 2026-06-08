/**
 * @typedef {import('../models/CenterForAdmin.js').CenterForAdmin} CenterForAdmin
 * @typedef {import('../../infrastructure/repositories/certification-center.repository.js')} CertificationCenterRepository
 * @typedef {import('../../../shared/infrastructure/repositories/admin-member.repository.js')} AdminMemberRepository
 */

import { CenterForAdminFactory } from '../models/factories/CenterForAdminFactory.js';

/**
 * @param {Object} params
 * @param {CertificationCenterRepository} params.certificationCenterRepository
 * @param {AdminMemberRepository} params.adminMemberRepository
 * @returns {CenterForAdmin}
 */
const getCenterForAdmin = async function ({
  id,
  adminMemberRepository,
  certificationCenterRepository,
  dataProtectionOfficerRepository,
}) {
  const center = await certificationCenterRepository.getById({ id });
  const dataProtectionOfficer = await dataProtectionOfficerRepository.get({
    certificationCenterId: id,
  });

  let archivistFullName = null;

  if (center.archivedAt) {
    const adminMember = await adminMemberRepository.get({ userId: center.archivedBy });

    archivistFullName = adminMember.fullName;
  }

  return CenterForAdminFactory.fromCenterAndDataProtectionOfficer({
    center,
    archivistFullName,
    dataProtectionOfficer,
  });
};

export { getCenterForAdmin };
