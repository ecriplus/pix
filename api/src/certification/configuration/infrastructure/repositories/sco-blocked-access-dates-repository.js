import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { ScoBlockedAccessDate } from '../../domain/models/ScoBlockedAccessDate.js';

/**
 * @returns {Promise<Array<ScoBlockedAccessDate>>}
 */
export const getScoBlockedAccessDates = async () => {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn('certification_sco_blocked_access_dates').select(
    'scoOrganizationTagName',
    'reopeningDate',
  );
  return data.map(_toDomain);
};

/**
 * @returns {Promise<ScoBlockedAccessDate>}
 * @throws {NotFoundError} if ScoBlockedAccessDate does not exist
 */
export const findScoBlockedAccessDateByKey = async (scoOrganizationTagName) => {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn('certification_sco_blocked_access_dates')
    .select('scoOrganizationTagName', 'reopeningDate')
    .where({ scoOrganizationTagName });
  if (data.length > 0) {
    return _toDomain(data[0]);
  } else {
    throw new NotFoundError(`ScoBlockedAccessDate ${scoOrganizationTagName} does not exist.`);
  }
};

/**
 * @param {Object} params
 * @param {ScoBlockedAccessDate} params.scoBlockedAccessDate
 */
export const updateScoBlockedAccessDate = async (scoBlockedAccessDate) => {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('certification_sco_blocked_access_dates')
    .update({ reopeningDate: scoBlockedAccessDate.reopeningDate })
    .where({ scoOrganizationTagName: scoBlockedAccessDate.scoOrganizationTagName });
};

const _toDomain = ({ scoOrganizationTagName, reopeningDate }) => {
  return new ScoBlockedAccessDate({ scoOrganizationTagName, reopeningDate });
};
