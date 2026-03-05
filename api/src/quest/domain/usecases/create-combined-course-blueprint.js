import { COMBINED_COURSE_BLUEPRINT_ITEMS } from '../models/CombinedCourseBlueprint.js';

export const createCombinedCourseBlueprint = async ({
  combinedCourseBlueprint,
  combinedCourseBlueprintRepository,
  targetProfileRepository,
  moduleRepository,
}) => {
  const targetProfileIds = combinedCourseBlueprint.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION)
    .map(({ value }) => value);
  await targetProfileRepository.findByIds({ ids: targetProfileIds });

  const moduleShortIds = combinedCourseBlueprint.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE)
    .map(({ value }) => value);
  await moduleRepository.getByShortIds({ moduleShortIds });

  return combinedCourseBlueprintRepository.save({ combinedCourseBlueprint });
};
