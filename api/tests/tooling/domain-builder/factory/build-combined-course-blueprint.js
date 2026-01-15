import {
  COMBINED_COURSE_BLUEPRINT_ITEMS,
  CombinedCourseBlueprint,
} from '../../../../src/quest/domain/models/CombinedCourseBlueprint.js';

function buildCombinedCourseBlueprint({
  id = 1,
  name = 'Mon parcours',
  internalName = 'Mon modèle de parcours',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  illustration = '/illustrations/image.svg',
  createdAt = new Date(),
  updatedAt = new Date(),
  content = [{ type: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE, value: 'module-123' }],
  organizationIds = [],
} = {}) {
  return new CombinedCourseBlueprint({
    id,
    name,
    internalName,
    description,
    illustration,
    content,
    createdAt,
    updatedAt,
    organizationIds,
  });
}

export { buildCombinedCourseBlueprint };
