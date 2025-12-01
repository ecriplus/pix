import { NotFoundError } from '../../../shared/domain/errors.js';

export const getCombinedCourseParticipationById = async ({
  participationId,
  combinedCourseId,
  combinedCourseParticipationRepository,
  combinedCourseDetailsService,
}) => {
  const participation = await combinedCourseParticipationRepository.findById({ participationId });

  if (participation === null) {
    throw new NotFoundError(
      `CombinedCourseParticipation introuvable à l'id ${participationId} pour le combined course ${combinedCourseId}`,
    );
  }

  const combinedCourseDetails = await combinedCourseDetailsService.getCombinedCourseDetails({
    organizationLearnerId: participation.organizationLearnerId,
    combinedCourseId,
  });

  return combinedCourseDetails;
};
