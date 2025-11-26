import { Eligibility } from '../../domain/models/Eligibility.js';

export const find = async ({ userId, organizationLearnerWithParticipationApi }) => {
  const result = await organizationLearnerWithParticipationApi.find({ userIds: [userId] });
  return result.map(toDomain);
};

export const findByOrganizationAndOrganizationLearnerId = async ({
  organizationLearnerId,
  organizationId,
  organizationLearnerWithParticipationApi,
  organizationLearnerParticipationRepository,
  moduleIds = [],
}) => {
  const passages = await organizationLearnerParticipationRepository.findByOrganizationLearnerIdAndModuleIds({
    organizationLearnerId,
    moduleIds,
  });
  const result = await organizationLearnerWithParticipationApi.findByOrganizationAndOrganizationLearnerId({
    organizationLearnerId,
    organizationId,
  });
  return toDomain({ ...result, passages });
};

const toDomain = (organizationLearnersWithParticipations) => new Eligibility(organizationLearnersWithParticipations);
