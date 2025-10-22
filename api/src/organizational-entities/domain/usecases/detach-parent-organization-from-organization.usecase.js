import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { UnableToDetachParentOrganizationFromChildOrganization } from '../errors.js';

const detachParentOrganizationFromOrganization = withTransaction(async function ({
  childOrganizationId,
  organizationForAdminRepository,
}) {
  const childOrganization = await organizationForAdminRepository.get({ organizationId: childOrganizationId });

  _checkOrganizationHasParent(childOrganization);

  childOrganization.updateParentOrganizationId(null);

  await organizationForAdminRepository.update({ organization: childOrganization });
});

function _checkOrganizationHasParent(organization) {
  if (!organization.parentOrganizationId) {
    throw new UnableToDetachParentOrganizationFromChildOrganization({
      message: 'Unable to detach parent organization from child because it has no parent.',
      meta: { organizationId: Number(organization.id) },
    });
  }
}
export { detachParentOrganizationFromOrganization };
