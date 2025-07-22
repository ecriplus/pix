import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourseParticipation } from '../../domain/models/CombinedCourseParticipation.js';

export const save = async function ({ organizationLearnerId, questId }) {
  const knexConnection = DomainTransaction.getConnection();
  await knexConnection('quest_participations')
    .insert({
      questId,
      organizationLearnerId,
    })
    .onConflict(['questId', 'organizationLearnerId'])
    .ignore();
};

export const getByUserId = async function ({ userId, questId }) {
  const knexConnection = DomainTransaction.getConnection();

  const questParticipations = await knexConnection('quest_participations')
    .select('quest_participations.id', 'questId', 'organizationLearnerId', 'quest_participations.status')
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      '=',
      'quest_participations.organizationLearnerId',
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
