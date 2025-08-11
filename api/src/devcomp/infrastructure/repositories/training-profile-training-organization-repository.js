import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

const TABLE_NAME = 'target-profile-training-organizations';

export async function getOrganizations(targetProfileTrainingId) {
  const knexConn = DomainTransaction.getConnection();
  return await knexConn(TABLE_NAME).pluck('organizationId').where({ targetProfileTrainingId });
}
