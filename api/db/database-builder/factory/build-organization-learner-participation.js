import _ from 'lodash';

import { databaseBuffer } from '../database-buffer.js';
import { buildOrganizationLearner } from './prescription/organization-learners/build-organization-learner.js';

const buildOrganizationLearnerParticipation = function ({
  id = databaseBuffer.getNextId(),
  type = 'passage',
  createdAt = new Date(),
  updatedAt = new Date(),
  completedAt = null,
  deletedAt = null,
  deletedBy = null,
  organizationLearnerId,
  status,
  moduleId,
} = {}) {
  organizationLearnerId = _.isUndefined(organizationLearnerId) ? buildOrganizationLearner().id : organizationLearnerId;

  const values = {
    id,
    type,
    createdAt,
    updatedAt,
    completedAt,
    deletedAt,
    deletedBy,
    organizationLearnerId,
    status,
  };

  const organizationLearnerParticipation = databaseBuffer.pushInsertable({
    tableName: 'organization_learner_participations',
    values,
  });

  databaseBuffer.pushInsertable({
    tableName: 'organization_learner_passage_participations',
    values: { id, moduleId, organizationLearnerParticipationId: organizationLearnerParticipation.id },
  });

  return organizationLearnerParticipation;
};

export { buildOrganizationLearnerParticipation };
