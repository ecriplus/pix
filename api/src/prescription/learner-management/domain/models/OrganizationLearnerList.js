import { logger } from '../../../../shared/infrastructure/utils/logger.js';
import { CouldNotDeleteLearnersError } from '../errors.js';

class OrganizationLearnerList {
  constructor({ organizationId, organizationLearners } = {}) {
    this.organizationId = organizationId;
    this.organizationLearners = organizationLearners;
  }

  canDeleteOrganizationLearners(organizationLearnerIdsToValidate, userId) {
    const organizationLearnersNotBelongingToOrganization = organizationLearnerIdsToValidate.filter(
      (organizationLearnerId) => {
        return !this.organizationLearners
          .map((organizationLearner) => organizationLearner.id)
          .includes(organizationLearnerId);
      },
    );
    if (organizationLearnersNotBelongingToOrganization.length !== 0) {
      logger.error(
        `User id ${userId} could not delete organization learners because learner id ${organizationLearnersNotBelongingToOrganization.join(',')} don't belong to organization id ${this.organizationId} "`,
      );
      throw new CouldNotDeleteLearnersError();
    }
  }
}

export { OrganizationLearnerList };
