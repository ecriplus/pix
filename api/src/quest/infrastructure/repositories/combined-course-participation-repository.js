import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { filterByFullName } from '../../../shared/infrastructure/utils/filter-utils.js';
import { fetchPage } from '../../../shared/infrastructure/utils/knex-utils.js';
import { CombinedCourseParticipation } from '../../domain/models/CombinedCourseParticipation.js';
import {
  OrganizationLearnerParticipation,
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../domain/models/OrganizationLearnerParticipation.js';

export const save = async function ({ organizationLearnerId, combinedCourseId }) {
  const knexConnection = DomainTransaction.getConnection();

  const existingCombinedCourse = await knexConnection('organization_learner_participations')
    .where({
      referenceId: combinedCourseId.toString(),
      organizationLearnerId,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .first();

  if (existingCombinedCourse) return;

  await knexConnection('organization_learner_participations')
    .insert({
      organizationLearnerId,
      status: OrganizationLearnerParticipationStatuses.STARTED,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      referenceId: combinedCourseId,
    })
    .returning('id');
};

/**
 * @param {number} participationId
 * @returns {Promise<CombinedCourseParticipation | null>}
 */
export const findById = async function ({ participationId }) {
  const knexConnection = DomainTransaction.getConnection();
  const combinedCourseParticipation = await knexConnection('organization_learner_participations')
    .select('organization_learner_participations.id', 'organizationLearnerId')
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'organization_learner_participations.organizationLearnerId',
    )
    .where({
      'organization_learner_participations.id': participationId,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .whereNull('organization_learner_participations.deletedAt')
    .first();
  if (!combinedCourseParticipation) return null;
  return new CombinedCourseParticipation(combinedCourseParticipation);
};

/**
 * @param {number} combinedCourseId
 * @param {number} participationId
 * @returns {Promise<boolean>}
 */
export const isParticipationOnCombinedCourse = async function ({ combinedCourseId, participationId }) {
  const knexConnection = DomainTransaction.getConnection();
  const { count } = await knexConnection('organization_learner_participations')
    .select(knexConnection.raw('count(1)'))
    .where({
      referenceId: combinedCourseId.toString(),
      'organization_learner_participations.id': participationId,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .first();
  return Boolean(count);
};

export const getByUserId = async function ({ userId, combinedCourseId }) {
  const knexConnection = DomainTransaction.getConnection();

  const combinedCourseParticipations = await knexConnection('organization_learner_participations')
    .select(
      'organization_learner_participations.id',
      'organizationLearnerId',
      'view-active-organization-learners.firstName',
      'view-active-organization-learners.lastName',
      'view-active-organization-learners.division',
      'view-active-organization-learners.group',
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

  const knexConnection = DomainTransaction.getConnection();
export const findByLearnerId = async function ({ organizationLearnerId, combinedCourseId }) {

  const combinedCourseParticipation = await knexConnection('organization_learner_participations')
    .select(
      'organization_learner_participations.id',
      'organizationLearnerId',
      'view-active-organization-learners.firstName',
      'view-active-organization-learners.lastName',
      'view-active-organization-learners.division',
      'view-active-organization-learners.group',
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
      'view-active-organization-learners.id': organizationLearnerId,
      'organization_learner_participations.referenceId': combinedCourseId.toString(),
      'organization_learner_participations.type': OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .whereNull('organization_learner_participations.deletedAt')
    .orderBy('organization_learner_participations.createdAt', 'DESC')
    .first();

  if (!combinedCourseParticipation) return null;

  return new CombinedCourseParticipation(combinedCourseParticipation);
};

export const findPaginatedCombinedCourseParticipationById = async function ({ combinedCourseId, page, filters }) {
  const knexConnection = DomainTransaction.getConnection();

  const queryBuilder = knexConnection('organization_learner_participations')
    .select('view-active-organization-learners.id')
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'organization_learner_participations.organizationLearnerId',
    )
    .where({
      referenceId: combinedCourseId.toString(),
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
    })
    .orderBy(['lastName', 'firstName']);

  queryBuilder.modify(addSearchFilters, filters);
  const { results, pagination } = await fetchPage({ queryBuilder, paginationParams: page });
  return {
    organizationLearnerIds: results.map((result) => result.id),
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
  if (filters.divisions?.length > 0) {
    queryBuilder.whereIn('view-active-organization-learners.division', filters.divisions);
  }
  if (filters.groups?.length > 0) {
    queryBuilder.whereIn('view-active-organization-learners.group', filters.groups);
  }
}

export const update = async function ({ id, ...updateFields }) {
  const knexConnection = DomainTransaction.getConnection();
  const updatedRow = await knexConnection('organization_learner_participations')
    .where({ id })
    .update(updateFields)
    .returning('*');
  return new OrganizationLearnerParticipation(updatedRow[0]);
};

/**
 * @param {[number]} combinedCourseIds
 * @returns {Promise<[CombinedCourseParticipation]>}
 */
export const findByCombinedCourseIds = async ({ combinedCourseIds }) => {
  const knexConnection = DomainTransaction.getConnection();
  const results = await knexConnection('organization_learner_participations')
    .select('organization_learner_participations.status', 'organization_learner_participations.referenceId')
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'organization_learner_participations.organizationLearnerId',
    )
    .whereIn(
      'organization_learner_participations.referenceId',
      combinedCourseIds.map((combinedCourseId) => combinedCourseId.toString()),
    )
    .where('organization_learner_participations.type', OrganizationLearnerParticipationTypes.COMBINED_COURSE);

  return results.map((participation) => new CombinedCourseParticipation(participation));
};
