const findLearningContentsByOrganizationId = async function ({ organizationId, locale, learningContentRepository }) {
  return learningContentRepository.findByOrganizationId({
    organizationId,
    locale,
  });
};

export { findLearningContentsByOrganizationId };
