export const findCombinedCourseParticipations = async ({
  combinedCourseId,
  page,
  filters,
  combinedCourseParticipationRepository,
  combinedCourseDetailsService,
}) => {
  const { organizationLearnerIds, meta } =
    await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
      combinedCourseId,
      page,
      filters,
    });

  const combinedCourseDetails = await combinedCourseDetailsService.instantiateCombinedCourseDetails({
    combinedCourseId,
  });

  const resultsByLearnerId = await combinedCourseDetailsService.getCombinedCourseDetailsForMultipleLearners({
    organizationLearnerIds,
    combinedCourseDetails,
  });

  return {
    combinedCourseParticipations: resultsByLearnerId
      .values()
      .toArray()
      .map(({ participationDetails }) => participationDetails),
    meta,
  };
};
