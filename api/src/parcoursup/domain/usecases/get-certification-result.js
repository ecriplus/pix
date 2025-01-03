const getCertificationResult = function ({
  ine,
  organizationUai,
  lastName,
  firstName,
  birthdate,
  certificationRepository,
  verificationCode,
}) {
  if (ine) {
    return certificationRepository.getByINE({ ine });
  }

  if (organizationUai) {
    return certificationRepository.getByOrganizationUAI({ organizationUai, lastName, firstName, birthdate });
  }

  if (verificationCode) {
    return certificationRepository.getByVerificationCode({ verificationCode, lastName, firstName });
  }
};

export { getCertificationResult };
