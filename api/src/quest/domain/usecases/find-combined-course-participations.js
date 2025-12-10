import { PromiseUtils } from '../../../shared/infrastructure/utils/promise-utils.js';

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
  const combinedCourseParticipations = await PromiseUtils.mapSeries(
    organizationLearnerIds,
    async (organizationLearnerId) => {
      const combinedCourseDetail = await combinedCourseDetailsService.getCombinedCourseDetails({
        organizationLearnerId,
        combinedCourseDetails,
      });
      return combinedCourseDetail.participationDetails;
    },
  );

  return {
    combinedCourseParticipations,
    meta,
  };
};
