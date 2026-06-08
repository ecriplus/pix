import { databaseBuffer } from '../database-buffer.js';

const buildFactStructure = function ({
  structureId,
  networkId,
  parentStructureId,
  childStructureId,
  organizationId,
  certificationCenterId,
} = {}) {
  const values = {
    structure_id: structureId,
    network_id: networkId,
    parent_structure_id: parentStructureId,
    child_structure_id: childStructureId,
    organization_id: organizationId,
    certification_center_id: certificationCenterId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'fct_structures',
    values,
  });
};

export { buildFactStructure };
