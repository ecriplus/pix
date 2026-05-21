import { CombinedCourseBlueprint } from '../models/CombinedCourseBlueprint.js';

export const createCombinedCourseBlueprint = async ({
  adminCombinedCourseBlueprint,
  combinedCourseBlueprintRepository,
  targetProfileRepository,
}) => {
  await targetProfileRepository.findByIds({ ids: adminCombinedCourseBlueprint.targetProfileIds });

  return combinedCourseBlueprintRepository.save({
    combinedCourseBlueprint: new CombinedCourseBlueprint({ ...adminCombinedCourseBlueprint }),
  });
};
