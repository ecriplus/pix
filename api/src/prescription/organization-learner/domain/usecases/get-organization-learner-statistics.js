const getOrganizationLearnerStatistics = async ({ organizationId, ownerId, organizationLearnerStatisticsRepository }) =>
  await organizationLearnerStatisticsRepository.getParticipationStatistics({
    organizationId,
    ownerId,
  });

export { getOrganizationLearnerStatistics };
