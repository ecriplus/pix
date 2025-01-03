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
    return certificationRepository.get({ ine });
  }

  if (organizationUai && lastName && firstName && birthdate) {
    return certificationRepository.getByStudentDetails({ organizationUai, lastName, firstName, birthdate });
  }

  if (verificationCode && lastName && firstName) {
    return certificationRepository.getByVerificationCode({ verificationCode, lastName, firstName });
  }
};

export { getCertificationResult };
