import { NotFoundError } from '../../../shared/domain/errors.js';

export async function detachOrganizationFromCombinedCourseBlueprint({
  organizationId,
  combinedCourseBlueprintId,
  combinedCourseBlueprintRepository,
}) {
  const blueprint = await combinedCourseBlueprintRepository.findById({ id: combinedCourseBlueprintId });
  if (!blueprint) {
    throw new NotFoundError(`Combined course blueprint with id:${combinedCourseBlueprintId} not found`);
  }
  blueprint.detachOrganization({ organizationId });
  await combinedCourseBlueprintRepository.save({ combinedCourseBlueprint: blueprint });
}
