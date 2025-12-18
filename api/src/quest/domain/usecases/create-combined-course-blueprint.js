export const createCombinedCourseBlueprint = async ({ combinedCourseBlueprint, combinedCourseBlueprintRepository }) => {
  return combinedCourseBlueprintRepository.save(combinedCourseBlueprint);
};
