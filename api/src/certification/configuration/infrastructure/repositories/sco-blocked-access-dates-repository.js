import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { ScoBlockedAccessDate } from '../../domain/read-models/ScoBlockedAccessDate.js';

/**
 * @returns {Promise<Array<ScoBlockedAccessDate>>}
 */
export const getScoBlockedAccessDates = async () => {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn('sco_blocked_access_dates').select('scoOrganizationType', 'reopeningDate');
  return data.map(_toDomain);
};

/**
 * @param {Object} params
 * @param {String} params.scoOrganizationType
 * @param {Date} params.reopeningDate
 */
export const updateScoBlockedAccessDate = async ({ scoOrganizationType, reopeningDate }) => {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('sco_blocked_access_dates').update({ reopeningDate }).where({ scoOrganizationType });
};

const _toDomain = ({ scoOrganizationType, reopeningDate }) => {
  return new ScoBlockedAccessDate({ scoOrganizationType, reopeningDate });
};
