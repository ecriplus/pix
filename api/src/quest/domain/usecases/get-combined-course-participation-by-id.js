import { NotFoundError } from '../../../shared/domain/errors.js';

export const getCombinedCourseParticipationById = async ({
  participationId,
  combinedCourseParticipationRepository,
}) => {
  const participation = await combinedCourseParticipationRepository.findById({ participationId });

  if (participation === null) {
    throw new NotFoundError(`CombinedCourseParticipation introuvable à l'id ${participationId}`);
  }

  return participation;
};
