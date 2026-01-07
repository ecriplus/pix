import { COMBINED_COURSE_BLUEPRINT_ITEMS } from '../models/CombinedCourseBlueprint.js';

export const createCombinedCourseBlueprint = async ({
  combinedCourseBlueprint,
  combinedCourseBlueprintRepository,
  targetProfileRepository,
}) => {
  const targetProfileIds = combinedCourseBlueprint.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION)
    .map(({ value }) => value);
  await targetProfileRepository.findByIds({ ids: targetProfileIds });
  return combinedCourseBlueprintRepository.save({ combinedCourseBlueprint });
};
