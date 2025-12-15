import { CombinedCourseBlueprint } from '../../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';

export const buildCombinedCourseBlueprint = function ({
  id = 1,
  name = 'Mon parcours combiné',
  internalName = 'Mon schéma de parcours combiné',
  description = 'Le but de ma quête',
  illustration = 'images/illustration.svg',
  createdAt = new Date(),
  updatedAt,
  content = [CombinedCourseBlueprint.buildContentItems([{ moduleId: 'module-id' }, { targetProfileId: 123 }])],
} = {}) {
  return new CombinedCourseBlueprint({
    id,
    name,
    internalName,
    description,
    illustration,
    createdAt,
    updatedAt,
    content,
  });
};
