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

  const combinedCourseParticipations = await PromiseUtils.mapSeries(
    organizationLearnerIds,
    async (organizationLearnerId) => {
      const combinedCourseDetails = await combinedCourseDetailsService.getCombinedCourseDetails({
        organizationLearnerId,
        combinedCourseId,
      });
      return combinedCourseDetails.participationDetails;
    },
  );

  return {
    combinedCourseParticipations,
    meta,
  };
};
