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

  const combinedCourseDetails = await combinedCourseDetailsService.instantiateCombinedCourseDetails({
    combinedCourseId: combinedCourse.id,
  });

  const combinedCourseDetailsBeforeUpdate = await combinedCourseDetailsService.getCombinedCourseDetails({
    organizationLearnerId,
    combinedCourseDetails,
  });

  const moduleToSynchronizeIds = combinedCourseDetailsBeforeUpdate.items
    .filter((item) => item.type === COMBINED_COURSE_ITEM_TYPES.MODULE)
    .map((item) => item.id);

  if (!combinedCourseDetailsBeforeUpdate.participation) {
    return null;
  }

  await organizationLearnerPassageParticipationRepository.synchronize({
    organizationLearnerId,
    moduleIds: moduleToSynchronizeIds,
  });

  // TODO: remove this when we have a better way to handle this . it makes my hair stand on end
  const updatedCombinedCourseDetails = await combinedCourseDetailsService.getCombinedCourseDetails({
    organizationLearnerId,
    combinedCourseDetails,
  });

  const isCombinedCourseCompleted = await updatedCombinedCourseDetails.items.every((item) => item.isCompleted);

  if (isCombinedCourseCompleted) {
    updatedCombinedCourseDetails.participation.complete();
    const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromCombinedCourse(
      updatedCombinedCourseDetails.participation,
    );
    await combinedCourseParticipationRepository.update(organizationLearnerParticipation.fieldsForUpdate);
  }

  return updatedCombinedCourseDetails.participation;
}
