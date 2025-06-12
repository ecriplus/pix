import {
  OrganizationLearnerDisabledError,
  UserNotAuthorizedToAccessEntityError,
} from '../../../../shared/domain/errors.js';

const findAssociationBetweenUserAndOrganizationLearner = async function ({
  authenticatedUserId,
  requestedUserId,
  organizationId,
  registrationOrganizationLearnerRepository,
}) {
  if (authenticatedUserId !== requestedUserId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }

  const organizationLearner = await registrationOrganizationLearnerRepository.findOneByUserIdAndOrganizationId({
    userId: authenticatedUserId,
    organizationId,
  });

  if (organizationLearner && organizationLearner.isDisabled) {
    throw new OrganizationLearnerDisabledError();
  }

  return organizationLearner;
};

export { findAssociationBetweenUserAndOrganizationLearner };
