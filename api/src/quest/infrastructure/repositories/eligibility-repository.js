import { Eligibility } from '../../domain/models/Eligibility.js';

export const find = async ({ userId, organizationLearnerWithParticipationApi }) => {
  const result = await organizationLearnerWithParticipationApi.find({ userIds: [userId] });
  return result.map(toDomain);
};

export const findByUserIdAndOrganizationId = async ({
  userId,
  organizationId,
  organizationLearnerWithParticipationApi,
}) => {
  const result = await organizationLearnerWithParticipationApi.getByUserIdAndOrganizationId({ userId, organizationId });
  return toDomain(result);
};

const toDomain = (organizationLearnersWithParticipations) => new Eligibility(organizationLearnersWithParticipations);
