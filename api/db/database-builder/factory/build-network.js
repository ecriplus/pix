import { databaseBuffer } from '../database-buffer.js';
import { buildFactStructure } from './build-fact-structure.js';
import { buildOrganization } from './build-organization.js';
import { buildStructure } from './build-structure.js';

const buildNetwork = function ({
  id = databaseBuffer.getNextId(),
  name = 'Network',
  createdAt = new Date(),
  updatedAt,
} = {}) {
  const values = {
    id,
    name,
    created_at: createdAt,
    updated_at: updatedAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'networks',
    values,
  });
};
const buildNetworkAndHeadOrganization = function ({
  id = databaseBuffer.getNextId(),
  name = 'Network',
  organizationId,
  organizationName = 'Head Organization',
} = {}) {
  const network = buildNetwork({ id, name });
  const organization = buildOrganization({ id: organizationId, name: organizationName });
  const structure = buildStructure();
  buildFactStructure({ structureId: structure.id, networkId: network.id, organizationId: organization.id });
  return network;
};

export { buildNetwork, buildNetworkAndHeadOrganization };
