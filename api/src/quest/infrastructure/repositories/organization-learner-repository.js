import * as organizationLearnerApi from '../../../prescription/organization-learner/application/api/organization-learners-api.js';

export const findByUserId = async ({ userId, dependencies = { organizationLearnerApi } }) => {
  return dependencies.organizationLearnerApi.findByUserId(userId);
};
