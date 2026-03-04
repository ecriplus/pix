import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { Network } from '../../domain/models/Network.js';

/**
 *
 * @param {number} organizationId
 * @returns {Promise<Network>}
 */
async function findByOrganizationId(organizationId) {
  const knexConn = DomainTransaction.getConnection();

  const network = await knexConn('networks')
    .select('networks.id', 'networks.name')
    .innerJoin('fct_structures', 'networks.id', 'fct_structures.network_id')
    .where('fct_structures.organization_id', organizationId)
    .first();

  if (!network) {
    return null;
  }

  return _toDomain(network);
}

/**
 * @param {object} params
 * @param {number} params.organizationId
 * @param {string} params.networkName
 * @returns {Promise<void>}
 */
async function save({ organizationId, networkName }) {
  const knexConn = DomainTransaction.getConnection();

  const [{ id: structureId }] = await knexConn('structures').insert({}, ['id']);
  const [{ id: networkId }] = await knexConn('networks').insert({ name: networkName }, ['id']);
  await knexConn('fct_structures').insert({
    structure_id: structureId,
    organization_id: organizationId,
    network_id: networkId,
  });
}

function _toDomain(network) {
  return new Network(network);
}

export { findByOrganizationId, save };
