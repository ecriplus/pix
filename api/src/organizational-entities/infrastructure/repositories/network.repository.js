import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { Network } from '../../domain/models/Network.js';

/**
 * @param {object} [params]
 * @param {object} [params.filter]
 * @param {string} [params.filter.name]
 * @returns {Promise<Array<Network>>}
 */
async function findAll({ filter } = {}) {
  const knexConn = DomainTransaction.getConnection();

  const query = knexConn('networks').select('networks.id', 'networks.name').orderBy('name');

  if (filter?.name) {
    query.where(
      knexConn.raw(
        `
      regexp_replace(unaccent(networks.name), '[^[:alnum:]]', '', 'g')
      ILIKE
      '%' || regexp_replace(unaccent(?), '[^[:alnum:]]', '', 'g') || '%'
      `,
        [filter.name],
      ),
    );
  }

  const networks = await query;

  return networks.map(_toDomain);
}

/**
 * @param {number} networkId
 * @returns {Promise<Network>}
 */
async function getById(networkId) {
  const knexConn = DomainTransaction.getConnection();

  const network = await knexConn('fct_structures')
    .select(
      'fct_structures.network_id as id',
      'networks.name as name',
      'organizations.name as organizationName',
      'fct_structures.organization_id as organizationId',
    )
    .join('networks', 'fct_structures.network_id', 'networks.id')
    .join('organizations', 'fct_structures.organization_id', 'organizations.id')
    .where('fct_structures.network_id', networkId)
    .andWhere('fct_structures.parent_structure_id', null)
    .first();

  if (!network) {
    throw new NotFoundError();
  }

  return _toDomain({
    id: network.id,
    name: network.name,
    organizationId: network.organizationId,
    organizationName: network.organizationName,
  });
}

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
 * @returns {Promise<Network>}
 */
async function save({ organizationId, networkName }) {
  const knexConn = DomainTransaction.getConnection();

  const [savedNetwork] = await knexConn('networks').insert({ name: networkName }, ['id', 'name']);

  await knexConn('fct_structures')
    .update({
      network_id: savedNetwork.id,
    })
    .where({ organization_id: organizationId });

  return _toDomain(savedNetwork);
}

/**
 * @param {Network} network
 * @returns {Promise<Network>}
 */
async function update(network) {
  const knexConn = DomainTransaction.getConnection();

  const [updatedNetwork] = await knexConn('networks')
    .where({ id: network.id })
    .update({ name: network.name }, ['id', 'name']);

  if (!updatedNetwork) {
    throw new NotFoundError();
  }

  return _toDomain(updatedNetwork);
}

/**
 * @param {object} params
 * @param {number} params.childOrganizationId
 * @param {number} params.parentOrganizationId
 * @returns {Promise<void>}
 */
async function attachOrganization({ childOrganizationId, parentOrganizationId }) {
  const knexConn = DomainTransaction.getConnection();

  const parentFactStructure = await knexConn('id, structure_id')
    .from('fct_structures')
    .where({ organization_id: parentOrganizationId })
    .first();

  await knexConn('fct_structures').where({
    organization_id: childOrganizationId,
  });

  return knexConn('fct_structures').where({ organization_id: childOrganizationId }).update({
    network_id: parentFactStructure.network_id,
    parent_structure_id: parentFactStructure.structure_id,
  });
}

function _toDomain(network) {
  return new Network(network);
}

export { attachOrganization, findAll, findByOrganizationId, getById, save, update };
