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

function _toDomain(network) {
  return new Network(network);
}

export { findByOrganizationId };
