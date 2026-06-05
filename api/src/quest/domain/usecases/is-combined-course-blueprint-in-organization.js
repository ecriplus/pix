/**
 *
 * @param {Object} params
 * @param {number} params.combinedCourseBlueprintId
 * @param {number} params.organizationId
 * @param {import ('../usecases/index.js').CombinedCourseBlueprintShareRepository} params.combinedCourseBlueprintShareRepository
 * @returns {Promise<boolean>}
 */
export async function isCombinedCourseBlueprintInOrganization({
  combinedCourseBlueprintId,
  organizationId,
  combinedCourseBlueprintShareRepository,
}) {
  const result = await combinedCourseBlueprintShareRepository.findByCombinedCourseBlueprintIdAndOrganizationId({
    combinedCourseBlueprintId,
    organizationId,
  });
  return Boolean(result);
}
