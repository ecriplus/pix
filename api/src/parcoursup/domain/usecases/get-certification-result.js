const getCertificationResult = function ({ ine, certificationRepository }) {
  return certificationRepository.get({ ine });
};

export { getCertificationResult };
