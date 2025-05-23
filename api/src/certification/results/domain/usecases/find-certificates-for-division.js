import { NoCertificateForDivisionError } from '../../../../shared/domain/errors.js';

const findCertificatesForDivision = async function ({ organizationId, division, locale, certificateRepository }) {
  const certificates = await certificateRepository.findByDivisionForScoIsManagingStudentsOrganization({
    organizationId,
    division,
    locale,
  });

  if (certificates.length === 0) {
    throw new NoCertificateForDivisionError(division);
  }
  return certificates;
};

export { findCertificatesForDivision };
