import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { UnableToAttachChildOrganizationToParentOrganizationError } from '../errors.js';

const attachChildOrganizationToOrganization = withTransaction(
  async ({ childOrganizationIds, parentOrganizationId, organizationForAdminRepository }) => {
    await organizationForAdminRepository.get({
      organizationId: parentOrganizationId,
    });

    const childOrganizationIdsArray = childOrganizationIds.split(',').map(Number);

    for (const childOrganizationId of childOrganizationIdsArray) {
      _assertChildAndParentOrganizationIdsAreDifferent({
        childOrganizationId,
        parentOrganizationId,
      });
      await _assertChildOrganizationDoesNotHaveChildren({ childOrganizationId, organizationForAdminRepository });

      const childOrganizationForAdmin = await organizationForAdminRepository.get({
        organizationId: childOrganizationId,
      });

      _assertChildOrganizationNotAlreadyPartOfANetwork(childOrganizationForAdmin);

      childOrganizationForAdmin.updateParentOrganizationId(parentOrganizationId);

      await organizationForAdminRepository.update({ organization: childOrganizationForAdmin });
    }
  },
);

export { attachChildOrganizationToOrganization };

function _assertChildAndParentOrganizationIdsAreDifferent({ childOrganizationId, parentOrganizationId }) {
  if (childOrganizationId === parentOrganizationId) {
    throw new UnableToAttachChildOrganizationToParentOrganizationError({
      code: 'UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ITSELF',
      message: 'Unable to attach child organization to itself',
      meta: {
        childOrganizationId,
        parentOrganizationId,
      },
    });
  }
}

function _assertChildOrganizationNotAlreadyPartOfANetwork(childOrganizationForAdmin) {
  if (childOrganizationForAdmin.network) {
    throw new UnableToAttachChildOrganizationToParentOrganizationError({
      code: 'UNABLE_TO_ATTACH_ALREADY_ATTACHED_CHILD_ORGANIZATION',
      message: 'Unable to attach organization already belonging to a network',
      meta: {
        childOrganizationId: childOrganizationForAdmin.id,
      },
    });
  }
}

async function _assertChildOrganizationDoesNotHaveChildren({ childOrganizationId, organizationForAdminRepository }) {
  const children = await organizationForAdminRepository.findChildrenByParentOrganizationId({
    parentOrganizationId: childOrganizationId,
  });

  if (children.length) {
    throw new UnableToAttachChildOrganizationToParentOrganizationError({
      code: 'UNABLE_TO_ATTACH_PARENT_ORGANIZATION_AS_CHILD_ORGANIZATION',
      message: 'Unable to attach child organization because it is already parent of organizations',
      meta: {
        childOrganizationId,
      },
    });
  }
}
