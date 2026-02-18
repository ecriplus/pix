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

export const synchronize = async ({ organizationLearnerId, moduleIds, modulesApi, organizationLearnerApi }) => {
  if (moduleIds.length === 0) {
    return;
  }

  const knexConn = DomainTransaction.getConnection();

  const learner = await organizationLearnerApi.get(organizationLearnerId);
  const modulePassages = await modulesApi.getUserModuleStatuses({ userId: learner.userId, moduleIds });

  const learnerParticipationsByModule = await knexConn('organization_learner_participations')
    .select('organization_learner_participations.id', 'referenceId')
    .whereNull('deletedAt')
    .where('organizationLearnerId', organizationLearnerId)
    .whereIn('referenceId', moduleIds);

  for (const modulePassage of modulePassages) {
    const learnerParticipationModule = learnerParticipationsByModule.find(
      (learnerParticipation) => learnerParticipation.referenceId === modulePassage.id,
    );

    const { id: organizationLearnerParticipationId, ...organizationLearnerPassageParticipation } =
      OrganizationLearnerParticipation.buildFromPassage({
        id: learnerParticipationModule?.id,
        organizationLearnerId,
        createdAt: modulePassage.createdAt,
        status: modulePassage.status,
        updatedAt: modulePassage.updatedAt,
        terminatedAt: modulePassage.terminatedAt,
        moduleId: modulePassage.id,
      });

    if (organizationLearnerParticipationId) {
      await knexConn('organization_learner_participations')
        .update(organizationLearnerPassageParticipation)
        .where('id', organizationLearnerParticipationId);
    } else {
      await knexConn('organization_learner_participations').insert(organizationLearnerPassageParticipation);
    }
  }
};

export const deleteCombinedCourseParticipationByCombinedCourseIdAndOrganizationLearnerId = async ({
  combinedCourseId,
  userId,
  organizationLearnerId,
}) => {
  const knexConn = DomainTransaction.getConnection();

  await baseUpdateQuery(knexConn, userId)
    .where('organizationLearnerId', organizationLearnerId)
    .andWhere('referenceId', combinedCourseId.toString());
};

export const deletePassagesByModuleIdsAndOrganizationLearnerId = async ({
  moduleIds,
  organizationLearnerId,
  userId,
}) => {
  const knexConn = DomainTransaction.getConnection();

  await baseUpdateQuery(knexConn, userId)
    .whereIn('referenceId', moduleIds)
    .andWhere('organizationLearnerId', organizationLearnerId);
};
export const deleteCombinedCourseParticipations = async ({ combinedCourseIds, userId }) => {
  const knexConn = DomainTransaction.getConnection();

  const stringifiedCombinedCourseIds = combinedCourseIds.map((id) => id.toString());
  await baseUpdateQuery(knexConn, userId).whereIn(
    'organization_learner_participations.referenceId',
    stringifiedCombinedCourseIds,
  );
};

export const deletePassagesByModuleIds = async ({ moduleIds, userId }) => {
  const knexConn = DomainTransaction.getConnection();

  await baseUpdateQuery(knexConn, userId).whereIn('organization_learner_participations.referenceId', moduleIds);
};

function baseUpdateQuery(knexConn, userId) {
  return knexConn('organization_learner_participations').update({
    deletedAt: knexConn.fn.now(),
    deletedBy: userId,
    updatedAt: knexConn.fn.now(),
  });
}
