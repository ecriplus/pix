import { NotFoundError } from '../../../shared/domain/errors.js';

async function findChildrenOrganizations({ parentOrganizationId, organizationForAdminRepository }) {
  const parentOrganizationExist = await organizationForAdminRepository.exist({ organizationId: parentOrganizationId });

  if (!parentOrganizationExist) {
    throw new NotFoundError(`Organization with ID (${parentOrganizationId}) not found`);
  }

  const children = await organizationForAdminRepository.findChildrenByParentOrganizationId({ parentOrganizationId });

  return children;
}

export { findChildrenOrganizations };
