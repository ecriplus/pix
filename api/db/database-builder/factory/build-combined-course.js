import isUndefined from 'lodash/isUndefined.js';

import { databaseBuffer } from '../database-buffer.js';
import { buildOrganization } from './build-organization.js';
import { buildQuestForCombinedCourse } from './build-quest.js';

const buildCombinedCourse = function ({
  id = databaseBuffer.getNextId(),
  eligibilityRequirements = [],
  successRequirements = [],
  code = 'COMBINIX1',
  name = 'Mon parcours combiné',
  organizationId,
  description = 'Le but de ma quête',
  illustration = 'images/illustration.svg',
  createdAt = new Date(),
  updatedAt,
} = {}) {
  organizationId = isUndefined(organizationId) ? buildOrganization().id : organizationId;

  const questId = buildQuestForCombinedCourse({
    illustration,
    eligibilityRequirements,
    successRequirements,
    organizationId,
    code,
    name,
    description,
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
  };

  const insertedValues = databaseBuffer.pushInsertable({
    tableName: 'combined_courses',
    values,
  });
  return {
    ...insertedValues,
    // TODO: remove when use combined course id instead of quest.id to retrieve combined course
    id: questId,
  };
};

export { buildCombinedCourse };
