import { logger } from '../../../../shared/infrastructure/utils/logger.js';
import { CouldNotDeleteLearnersError } from '../errors.js';

class OrganizationLearnerList {
  constructor({ organizationId, organizationLearners } = {}) {
    this.organizationId = organizationId;
    this.organizationLearners = organizationLearners;
  }

  getDeletableOrganizationLearners(organizationLearnerIdsToDelete, userId) {
    if (this.organizationLearners.length !== organizationLearnerIdsToDelete.length) {
      logger.error(
        `User id ${userId} could not delete organization learners because some learner id in (${organizationLearnerIdsToDelete.join(',')}) don't belong to organization id ${this.organizationId}`,
      );
      throw new CouldNotDeleteLearnersError();
    }

    return this.organizationLearners;
  }
}

export { OrganizationLearnerList };
