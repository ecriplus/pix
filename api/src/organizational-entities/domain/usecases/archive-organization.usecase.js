import { withTransaction } from '../../../shared/domain/DomainTransaction.js';

const archiveOrganization = withTransaction(async function ({
  organizationId,
  userId,
  organizationForAdminRepository,
}) {
  await organizationForAdminRepository.archive({ id: organizationId, archivedBy: userId });
  return await organizationForAdminRepository.get({ organizationId });
});

export { archiveOrganization };
