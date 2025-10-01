import { ITEM_TYPE } from '../models/CombinedCourseItem.js';
import combinedCourseDetailsService from '../services/combined-course-details-service.js';

export async function updateCombinedCourse({
  userId,
  code,
  combinedCourseRepository,
  combinedCourseParticipationRepository,
  organizationLearnerPassageParticipationRepository,
}) {
  const combinedCourse = await combinedCourseRepository.getByCode({ code });
  const combinedCourseDetails = await combinedCourseDetailsService.getCombinedCourseDetails({
    userId,
    questId: combinedCourse.id,
  });

  const moduleToSynchronizeIds = combinedCourseDetails.items
    .filter((item) => item.type === ITEM_TYPE.MODULE)
    .map((item) => item.id);

  if (!combinedCourseDetails.participation) {
    return null;
  }

  await organizationLearnerPassageParticipationRepository.synchronize({
    organizationLearnerId: combinedCourseDetails.participation.organizationLearnerId,
    moduleIds: moduleToSynchronizeIds,
  });

  const isCombinedCourseCompleted = await combinedCourseDetails.items.every((item) => item.isCompleted);

  if (isCombinedCourseCompleted) {
    combinedCourseDetails.participation.complete();
    return combinedCourseParticipationRepository.update({
      combinedCourseParticipation: combinedCourseDetails.participation,
    });
  }

  return combinedCourseDetails.participation;
}
