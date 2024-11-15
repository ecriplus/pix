import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CenterTypes } from '../../domain/models/CenterTypes.js';

/**
 * @param {Object} params
 * @param {Array<number>} params.externalIds
 * @returns {Promise<void>}
 */
export const addToWhitelistByExternalIds = async ({ externalIds }) => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('certification-centers')
    .update({ isScoBlockedAccessWhitelist: true, updatedAt: knexConn.fn.now() })
    .where({ type: CenterTypes.SCO })
    .whereIn('externalId', externalIds);
};

/**
 * @returns {Promise<void>}
 */
export const resetWhitelist = async () => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('certification-centers')
    .update({ isScoBlockedAccessWhitelist: false, updatedAt: knexConn.fn.now() })
    .where({ type: CenterTypes.SCO });
};

/**
 * @param {Object} params
 * @param {Array<number>} params.preservedCenterIds
 * @returns {Promise<number>} updated centers count
 */
export const updateCentersToV3 = async ({ preservedCenterIds }) => {
  const knexConn = DomainTransaction.getConnection();
  const results = await knexConn('certification-centers')
    .update({ isV3Pilot: true, updatedAt: knexConn.fn.now() }, ['id'])
    .where({ isV3Pilot: false })
    .whereNotIn('id', preservedCenterIds);

  return results.length;
};

/**
 * @param {Object} params
 * @param {Array<number>} params.preservedCenterIds
 * @returns {Promise<Array<number>>} v2 center ids excluding preservedCenterIds
 */
export const findV2CenterIds = async ({ preservedCenterIds }) => {
  const knexConn = DomainTransaction.getConnection();
  const centers = await knexConn('certification-centers')
    .select('id')
    .where({ isV3Pilot: false })
    .whereNotIn('id', preservedCenterIds);

  return centers.map(({ id }) => id);
};
