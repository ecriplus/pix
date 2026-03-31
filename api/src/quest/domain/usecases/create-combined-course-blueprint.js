import _ from 'lodash';

import { COMBINED_COURSE_BLUEPRINT_ITEMS, CombinedCourseBlueprint } from '../models/CombinedCourseBlueprint.js';

export const createCombinedCourseBlueprint = async ({
  combinedCourseBlueprint,
  combinedCourseBlueprintRepository,
  targetProfileRepository,
  moduleRepository,
}) => {
  // We are using content from the front-end before building quests
  const targetProfileIds = combinedCourseBlueprint.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION)
    .map(({ value }) => value);
  await targetProfileRepository.findByIds({ ids: targetProfileIds });

  const moduleShortIds = combinedCourseBlueprint.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE)
    .map(({ value }) => value);
  const modules = await moduleRepository.getByShortIds({ moduleShortIds });
  const modulesByShortId = _.groupBy(modules, 'shortId');

  return combinedCourseBlueprintRepository.save({
    combinedCourseBlueprint: CombinedCourseBlueprint.buildWithQuest({ combinedCourseBlueprint, modulesByShortId }),
  });
};
