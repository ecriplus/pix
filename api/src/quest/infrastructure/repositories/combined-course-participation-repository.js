import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourseParticipation } from '../../domain/models/CombinedCourseParticipation.js';

export const save = async function ({ organizationLearnerId, questId }) {
  const knexConnection = DomainTransaction.getConnection();
  await knexConnection('combined_course_participations')
    .insert({
      questId,
      organizationLearnerId,
    })
    .onConflict(['questId', 'organizationLearnerId'])
    .ignore();
};

export const getByUserId = async function ({ userId, questId }) {
  const knexConnection = DomainTransaction.getConnection();

  const questParticipations = await knexConnection('combined_course_participations')
    .select(
      'combined_course_participations.id',
      'questId',
      'organizationLearnerId',
      'combined_course_participations.status',
      'combined_course_participations.createdAt',
      'combined_course_participations.updatedAt',
    )
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      '=',
      'combined_course_participations.organizationLearnerId',
    )
    .where({
      'view-active-organization-learners.userId': userId,
      questId,
    });
  if (questParticipations.length === 0) {
    throw new NotFoundError(
      `CombinedCourseParticipation introuvable pour l'utilisateur d'id ${userId} et la quête d'id ${questId}`,
    );
  }

  return new CombinedCourseParticipation(questParticipations[0]);
};

export const update = async function ({ combinedCourseParticipation }) {
  const knexConnection = DomainTransaction.getConnection();
  const [updatedRow] = await knexConnection('combined_course_participations')
    .where({ id: combinedCourseParticipation.id })
    .update({ status: combinedCourseParticipation.status, updatedAt: combinedCourseParticipation.updatedAt })
    .returning('*');

  return new CombinedCourseParticipation(updatedRow);
};

const buildBaseQuery = (knexConnection) => {
  return knexConnection('combined_courses')
    .select(
      'combined_course_participations.id',
      'firstName',
      'lastName',
      'combined_course_participations.status',
      'combined_course_participations.questId',
      'organizationLearnerId',
      'combined_course_participations.createdAt',
      'combined_course_participations.updatedAt',
    )
    .join('combined_course_participations', 'combined_courses.questId', 'combined_course_participations.questId')
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'combined_course_participations.organizationLearnerId',
    )
    .orderBy([
      { column: 'lastName', order: 'asc' },
      { column: 'firstName', order: 'asc' },
    ]);
};

/**
 * @param {number} combinedCourseId
 * @returns {Promise<CombinedCourseParticipation>}
 */
export const findByCombinedCourseId = async function ({ combinedCourseId }) {
  const knexConnection = DomainTransaction.getConnection();
  const questParticipations = await buildBaseQuery(knexConnection).where({ 'combined_courses.id': combinedCourseId });

  return questParticipations.map((participation) => new CombinedCourseParticipation(participation));
};

/**
 * @param {[number]} combinedCourseIds
 * @returns {Promise<[CombinedCourseParticipation]>}
 */
export const findByCombinedCourseIds = async ({ combinedCourseIds }) => {
  const knexConnection = DomainTransaction.getConnection();
  const questParticipations = await buildBaseQuery(knexConnection).whereIn('combined_courses.id', combinedCourseIds);

  return questParticipations.map((participation) => new CombinedCourseParticipation(participation));
};
