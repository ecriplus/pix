import isUndefined from 'lodash/isUndefined.js';

import { CombinedCourseBlueprint } from '../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildOrganization } from './build-organization.js';
import { buildQuestForCombinedCourse } from './build-quest.js';

const buildCombinedCourse = function ({
  id = databaseBuffer.getNextId(),
  combinedCourseContents = [],
  code = 'COMBINIX1',
  name = 'Mon parcours combiné',
  organizationId,
  description = 'Le but de ma quête',
  illustration = 'images/illustration.svg',
  createdAt = new Date(),
  updatedAt,
  combinedCourseBlueprintId,
} = {}) {
  organizationId = isUndefined(organizationId) ? buildOrganization().id : organizationId;

  const successRequirementsFromContents = combinedCourseContents.map((content) =>
    CombinedCourseBlueprint.buildRequirementForCombinedCourse(content).toDTO(),
  );

  const questId = buildQuestForCombinedCourse({
    successRequirements: successRequirementsFromContents,
  }).id;

  const values = {
    id,
    code,
    name,
    description,
    illustration,
    organizationId,
    createdAt,
    updatedAt: updatedAt ?? createdAt,
    questId,
    combinedCourseBlueprintId,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'combined_courses',
    values,
  });
};

export { buildCombinedCourse };
