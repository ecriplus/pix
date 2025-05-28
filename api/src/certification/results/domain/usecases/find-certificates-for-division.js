import { NoCertificateForDivisionError } from '../../../../shared/domain/errors.js';

const findCertificatesForDivision = async function ({ organizationId, division, certificateRepository }) {
  const certificates = await certificateRepository.findByDivisionForScoIsManagingStudentsOrganization({
    organizationId,
    division,
  });

  if (certificates.length === 0) {
    throw new NoCertificateForDivisionError(division);
  }
  return certificates;
};

export { findCertificatesForDivision };
