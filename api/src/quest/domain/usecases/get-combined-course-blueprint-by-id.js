import { NotFoundError } from '../../../shared/domain/errors.js';
import { COMBINED_COURSE_BLUEPRINT_ITEMS } from '../models/CombinedCourseBlueprint.js';

export const getCombinedCourseBlueprintById = async ({
  id,
  combinedCourseBlueprintRepository,
  targetProfileRepository,
  moduleRepository,
}) => {
  const result = await combinedCourseBlueprintRepository.findById({ id });
  if (!result) {
    throw new NotFoundError('Combined course blueprint not found');
  }

  const evaluationItemIds = result.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION)
    .map((item) => item.value);
  const moduleItemShortIds = result.content
    .filter((item) => item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE)
    .map((item) => item.value);

  const evaluationItems = await targetProfileRepository.findByIds({ ids: evaluationItemIds });
  const moduleItems = await moduleRepository.getByShortIds({ moduleShortIds: moduleItemShortIds });

  const evaluationMap = new Map(evaluationItems.map((item) => [item.id, item]));

  const moduleMap = new Map(moduleItems.map((item) => [item.shortId, item]));

  result.content = result.content.map((item) => ({
    ...item,
    label:
      item.type === COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION
        ? evaluationMap.get(item.value).name
        : moduleMap.get(item.value).title,
  }));

  return result;
};
