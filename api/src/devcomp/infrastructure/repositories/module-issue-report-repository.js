import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

export async function save(moduleIssueReport) {
  const knexConn = DomainTransaction.getConnection();
  const [result] = await knexConn('module_issue_reports').insert(moduleIssueReport).returning('id');

  return result.id;
}
