import { NotFoundError } from '../../../shared/domain/errors.js';

export async function attachOrganizationsToCombinedCourseBlueprint({
  organizationIds,
  combinedCourseBlueprintId,
  combinedCourseBlueprintRepository,
}) {
  const blueprint = await combinedCourseBlueprintRepository.findById({
    id: combinedCourseBlueprintId,
  });
  if (!blueprint) {
    throw new NotFoundError(`Combined course blueprint with id:${combinedCourseBlueprintId} not found`);
  }
  const { attachedOrganizationIds, duplicatedOrganizationIds } = blueprint.attachOrganizations({
    organizationIds,
  });
  await combinedCourseBlueprintRepository.save({
    combinedCourseBlueprint: blueprint,
  });
  return { attachedIds: attachedOrganizationIds, duplicatedIds: duplicatedOrganizationIds };
}
