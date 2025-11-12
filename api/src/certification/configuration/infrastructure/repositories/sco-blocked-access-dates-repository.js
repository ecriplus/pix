import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const getScoBlockedAccessDates = async () => {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn('sco-blocked-access-dates').select('key', 'value');

  return data;
};

export const updateScoBlockedAccessDate = async ({ key, value }) => {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('sco-blocked-access-dates').update({ value: value }).where({ key: key });
};
