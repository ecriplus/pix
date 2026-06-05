import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

export async function findByCombinedCourseBlueprintIdAndOrganizationId({ combinedCourseBlueprintId, organizationId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn('combined_course_blueprint_shares')
    .where({
      combinedCourseBlueprintId,
      organizationId,
    })
    .first();

  return result ?? null;
}
