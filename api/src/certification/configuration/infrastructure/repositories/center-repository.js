import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { Center } from '../../domain/models/Center.js';
import { CenterTypes } from '../../domain/models/CenterTypes.js';

/**
 * @param {Object} params
 * @param {Array<number>} params.externalIds
 * @returns {Array<number>} - number of rows affected
 */
export const addToWhitelistByExternalIds = async ({ externalIds }) => {
  const knexConn = DomainTransaction.getConnection();
  const updatedLines = await knexConn('certification-centers')
    .update({
      isScoBlockedAccessWhitelist: true,
      updatedAt: knexConn.fn.now(),
    })
    .where({
      type: CenterTypes.SCO,
      archivedAt: null,
    })
    .whereIn('externalId', externalIds)
    .returning('externalId');

  const updatedExternalIds = updatedLines.map((line) => line.externalId);
  return updatedExternalIds;
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
 * @returns {Promise<Array<Center>>}
 */
export const getWhitelist = async () => {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn('certification-centers')
    .select('id', 'type', 'externalId')
    .where({ isScoBlockedAccessWhitelist: true });

  return data.map(_toDomain);
};

const _toDomain = ({ id, externalId, type }) => {
  return new Center({ id, externalId, type });
};
