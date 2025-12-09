import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import {
  OrganizationLearnerParticipation,
  OrganizationLearnerParticipationTypes,
} from '../../domain/models/OrganizationLearnerParticipation.js';

export const findByOrganizationLearnerIdAndModuleIds = async ({ organizationLearnerId, moduleIds }) => {
  const knexConn = DomainTransaction.getConnection();

  const organizationLearnerParticipations = await knexConn('organization_learner_participations')
    .select('organization_learner_participations.*')
    .where({ organizationLearnerId, type: OrganizationLearnerParticipationTypes.PASSAGE })
    .whereIn('referenceId', moduleIds)
    .whereNull('deletedAt');

  if (!organizationLearnerParticipations) return [];

  return organizationLearnerParticipations.map(
    (organizationLearnerParticipation) => new OrganizationLearnerParticipation(organizationLearnerParticipation),
  );
};
