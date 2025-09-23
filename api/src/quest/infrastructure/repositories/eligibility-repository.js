import { Eligibility } from '../../domain/models/Eligibility.js';

export const find = async ({ userId, organizationLearnerWithParticipationApi }) => {
  const result = await organizationLearnerWithParticipationApi.find({ userIds: [userId] });
  return result.map(toDomain);
};

export const findByUserIdAndOrganizationId = async ({
  userId,
  organizationId,
  organizationLearnerWithParticipationApi,
  modulesApi,
  moduleIds = [],
}) => {
  const passages = await modulesApi.getUserModuleStatuses({ userId, moduleIds });
  const result = await organizationLearnerWithParticipationApi.getByUserIdAndOrganizationId({
    userId,
    organizationId,
  });
  return toDomain({ ...result, passages });
};

const toDomain = (organizationLearnersWithParticipations) => new Eligibility(organizationLearnersWithParticipations);
