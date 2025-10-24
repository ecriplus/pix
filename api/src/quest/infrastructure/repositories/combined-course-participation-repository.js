import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { filterByFullName } from '../../../shared/infrastructure/utils/filter-utils.js';
import { fetchPage } from '../../../shared/infrastructure/utils/knex-utils.js';
import { CombinedCourseParticipation } from '../../domain/models/CombinedCourseParticipation.js';
import {
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../domain/models/OrganizationLearnerParticipation.js';

export const save = async function ({ organizationLearnerId, combinedCourseId }) {
  const knexConnection = DomainTransaction.getConnection();

  const existingcombinedCourse = await knexConnection('organization_learner_participations')
    .where({
      referenceId: combinedCourseId.toString(),
      organizationLearnerId,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .first();

  if (existingcombinedCourse) return;

  await knexConnection('organization_learner_participations')
    .insert({
      organizationLearnerId,
      status: OrganizationLearnerParticipationStatuses.STARTED,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      referenceId: combinedCourseId,
    })
    .returning('id');
};

export const getByUserId = async function ({ userId, combinedCourseId }) {
  const knexConnection = DomainTransaction.getConnection();

  const combinedCourseParticipations = await knexConnection('organization_learner_participations')
    .select(
      'organization_learner_participations.id',
      'organizationLearnerId',
      'firstName',
      'lastName',
      'organization_learner_participations.status',
      'organization_learner_participations.createdAt',
      'organization_learner_participations.updatedAt',
      'organization_learner_participations.referenceId',
    )
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      '=',
      'organization_learner_participations.organizationLearnerId',
    )
    .where({
      'view-active-organization-learners.userId': userId,
      'organization_learner_participations.referenceId': combinedCourseId.toString(),
      'organization_learner_participations.type': OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    });
  if (combinedCourseParticipations.length === 0) {
    throw new NotFoundError(
      `CombinedCourseParticipation introuvable pour l'utilisateur d'id ${userId} et au parcours d'id ${combinedCourseId}`,
    );
  }
  return new CombinedCourseParticipation(combinedCourseParticipations[0]);
};

export const findPaginatedCombinedCourseParticipationById = async function ({ combinedCourseId, page, filters }) {
  const knexConnection = DomainTransaction.getConnection();

  const queryBuilder = knexConnection('organization_learner_participations')
    .select('view-active-organization-learners.userId')
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'organization_learner_participations.organizationLearnerId',
    )
    .where({
      referenceId: combinedCourseId.toString(),
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .whereNotNull('userId')
    .orderBy(['lastName', 'firstName', 'userId']);

  queryBuilder.modify(addSearchFilters, filters);
  const { results, pagination } = await fetchPage({ queryBuilder, paginationParams: page });
  return {
    userIds: results.map((result) => result.userId),
    meta: pagination,
  };
};

function addSearchFilters(queryBuilder, filters = {}) {
  if (filters.fullName) {
    filterByFullName(queryBuilder, filters.fullName, 'firstName', 'lastName');
  }
  if (filters.statuses?.length > 0) {
    queryBuilder.whereIn('organization_learner_participations.status', filters.statuses);
  }
}

export const update = async function ({ combinedCourseParticipation }) {
  const knexConnection = DomainTransaction.getConnection();
  const updatedRow = await knexConnection('organization_learner_participations')
    .where({ id: combinedCourseParticipation.id })
    .update({
      updatedAt: combinedCourseParticipation.updatedAt,
      status: combinedCourseParticipation.status,
      completedAt: combinedCourseParticipation.completedAt,
    })
    .returning('*');
  return new CombinedCourseParticipation(updatedRow[0]);
};

/**
 * @param {[number]} combinedCourseIds
 * @returns {Promise<[CombinedCourseParticipation]>}
 */
export const findByCombinedCourseIds = async ({ combinedCourseIds, page }) => {
  const knexConnection = DomainTransaction.getConnection();
  const queryBuilder = knexConnection('organization_learner_participations')
    .select(
      'organization_learner_participations.id',
      'firstName',
      'lastName',
      'organization_learner_participations.status',
      'organizationLearnerId',
      'organization_learner_participations.createdAt',
      'organization_learner_participations.updatedAt',
      'organization_learner_participations.referenceId',
    )
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'organization_learner_participations.organizationLearnerId',
    )
    .whereIn(
      'organization_learner_participations.referenceId',
      combinedCourseIds.map((combinedCourseId) => combinedCourseId.toString()),
    )
    .where('organization_learner_participations.type', OrganizationLearnerParticipationTypes.COMBINED_COURSE)
    .orderBy([
      { column: 'lastName', order: 'asc' },
      { column: 'firstName', order: 'asc' },
    ]);
  const { results, pagination } = await fetchPage({ queryBuilder, paginationParams: page });
  return {
    combinedCourseParticipations: results.map((participation) => new CombinedCourseParticipation(participation)),
    meta: { ...pagination },
  };
};
