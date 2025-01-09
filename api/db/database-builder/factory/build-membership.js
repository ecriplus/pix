import _ from 'lodash';

import { Membership } from '../../../src/shared/domain/models/Membership.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildOrganization } from './build-organization.js';
import { buildUser } from './build-user.js';

const buildMembership = function ({
  id = databaseBuffer.getNextId(),
  organizationRole = Membership.roles.MEMBER,
  organizationId,
  userId,
  createdAt = new Date(),
  updatedAt,
  disabledAt,
  updatedByUserId,
} = {}) {
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  organizationId = _.isUndefined(organizationId) ? buildOrganization().id : organizationId;
  if (!updatedAt) {
    updatedAt = disabledAt || createdAt;
  }
  const values = {
    id,
    organizationId,
    organizationRole,
    userId,
    createdAt,
    updatedAt,
    disabledAt,
    updatedByUserId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'memberships',
    values,
  });
};

export { buildMembership };
