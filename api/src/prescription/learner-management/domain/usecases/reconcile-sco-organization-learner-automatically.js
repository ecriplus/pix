import _ from 'lodash';

import { UserCouldNotBeReconciledError } from '../../../../shared/domain/errors.js';

const reconcileScoOrganizationLearnerAutomatically = async function ({
  organizationId,
  userId,
  organizationLearnerRepository,
}) {
  const studentOrganizationLearners = await organizationLearnerRepository.findByUserId({ userId });
  if (_.isEmpty(studentOrganizationLearners)) {
    throw new UserCouldNotBeReconciledError();
  }

  const nationalStudentIdForReconcile = _.orderBy(studentOrganizationLearners, 'updatedAt', 'desc')[0]
    .nationalStudentId;

  if (!nationalStudentIdForReconcile) {
    throw new UserCouldNotBeReconciledError();
  }

  return organizationLearnerRepository.reconcileUserByNationalStudentIdAndOrganizationId({
    userId,
    nationalStudentId: nationalStudentIdForReconcile,
    organizationId,
  });
};

export { reconcileScoOrganizationLearnerAutomatically };
