/**
 * @param {Object} params
 * @param {import('./index.js').CombinedCourseBlueprintRepository} params.combinedCourseBlueprintRepository
 * @returns {Promise<import('../models/CombinedCourseBlueprint.js').CombinedCourseBlueprint[]>}
 **/
export const findByOrganizationId = async ({ combinedCourseBlueprintRepository, organizationId }) => {
  return combinedCourseBlueprintRepository.findByOrganizationId({ organizationId });
};
