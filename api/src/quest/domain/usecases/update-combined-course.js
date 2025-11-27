import { COMBINED_COURSE_ITEM_TYPES } from '../models/CombinedCourseItem.js';
import { OrganizationLearnerParticipation } from '../models/OrganizationLearnerParticipation.js';

export async function updateCombinedCourse({
  userId,
  code,
  combinedCourseRepository,
  combinedCourseParticipationRepository,
  organizationLearnerPrescriptionRepository,
  organizationLearnerPassageParticipationRepository,
  combinedCourseDetailsService,
}) {
  const combinedCourse = await combinedCourseRepository.getByCode({ code });
  const organizationLearnerId = await organizationLearnerPrescriptionRepository.findIdByUserIdAndOrganizationId({
    userId,
    organizationId: combinedCourse.organizationId,
  });
  const combinedCourseDetails = await combinedCourseDetailsService.getCombinedCourseDetails({
    organizationLearnerId,
    combinedCourseId: combinedCourse.id,
  });

  const moduleToSynchronizeIds = combinedCourseDetails.items
    .filter((item) => item.type === COMBINED_COURSE_ITEM_TYPES.MODULE)
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
    const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromCombinedCourse(
      combinedCourseDetails.participation,
    );
    await combinedCourseParticipationRepository.update(organizationLearnerParticipation.fieldsForUpdate);
  }

  return combinedCourseDetails.participation;
}
