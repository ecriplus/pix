const getCertificationResult = function ({
  ine,
  organizationUai,
  lastName,
  firstName,
  birthdate,
  certificationRepository,
}) {
  if (ine) {
    return certificationRepository.get({ ine });
  }

  if (organizationUai && lastName && firstName && birthdate) {
    return certificationRepository.getByStudentDetails({ organizationUai, lastName, firstName, birthdate });
  }
};

export { getCertificationResult };
