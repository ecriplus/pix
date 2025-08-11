import _ from 'lodash';

import { CombinedCourseParticipationStatuses } from '../../../src/prescription/shared/domain/constants.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildOrganizationLearner } from './build-organization-learner.js';
import { buildQuest } from './build-quest.js';

const { STARTED } = CombinedCourseParticipationStatuses;

const buildCombinedCourseParticipation = function ({
  id = databaseBuffer.getNextId(),
  questId,
  organizationLearnerId,
  status = STARTED,
  createdAt = new Date(),
  updatedAt = new Date(),
} = {}) {
  organizationLearnerId = _.isUndefined(organizationLearnerId) ? buildOrganizationLearner().id : organizationLearnerId;
  questId = _.isUndefined(questId) ? buildQuest().id : questId;

  const values = {
    id,
    questId,
    organizationLearnerId,
    status,
    createdAt,
    updatedAt,
  };

  databaseBuffer.pushInsertable({
    tableName: 'combined_course_participations',
    values,
  });

  return {
    id,
    questId,
    organizationLearnerId,
    status,
    createdAt,
    updatedAt,
  };
};

export { buildCombinedCourseParticipation };
