import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourse } from '../models/CombinedCourse.js';

export async function getCombinedCourseByCode({
  userId,
  code,
  combinedCourseParticipationRepository,
  questRepository,
}) {
  const quest = await questRepository.getByCode({ code });

  let participation = null;
  try {
    participation = await combinedCourseParticipationRepository.getByUserId({ questId: quest.id, userId });
  } catch (err) {
    if ((!err) instanceof NotFoundError) {
      throw err;
    }
  }

  return new CombinedCourse(quest, participation);
}
