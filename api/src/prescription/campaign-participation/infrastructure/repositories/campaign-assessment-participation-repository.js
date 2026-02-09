import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { CampaignAssessmentParticipation } from '../../domain/models/CampaignAssessmentParticipation.js';
import { DetachedAssessment } from '../../domain/read-models/DetachedAssessment.js';

const getByCampaignIdAndCampaignParticipationId = async function ({ campaignId, campaignParticipationId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn
    .with('campaignAssessmentParticipation', (qb) => {
      qb.select([
        'campaign-participations.userId',
        'view-active-organization-learners.firstName',
        'view-active-organization-learners.lastName',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.campaignId',
        'campaign-participations.createdAt',
        'campaign-participations.sharedAt',
        'campaign-participations.status',
        'campaign-participations.participantExternalId',
        'campaign-participations.masteryRate',
        'campaign-participations.validatedSkillsCount',
        'view-active-organization-learners.id AS organizationLearnerId',
        'assessments.state AS assessmentState',
        _assessmentRankByCreationDate(knexConn),
      ])
        .from('campaign-participations')
        .join('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
        .join(
          'view-active-organization-learners',
          'view-active-organization-learners.id',
          'campaign-participations.organizationLearnerId',
        )
        .where({
          'campaign-participations.id': campaignParticipationId,
          'campaign-participations.campaignId': campaignId,
          'campaign-participations.deletedAt': null,
        });
    })
    .from('campaignAssessmentParticipation')
    .where({ rank: 1 })
    .first();

  if (result == null) {
    throw new NotFoundError(`There is no campaign participation with the id "${campaignParticipationId}"`);
  }

  return new CampaignAssessmentParticipation(result);
};

const getDetachedByUserId = async ({ userId }) => {
  const knexConn = DomainTransaction.getConnection();

  const result = await knexConn('assessments')
    .select(['id', 'state', 'updatedAt'])
    .whereNull('campaignParticipationId')
    .where({ userId, type: Assessment.types.CAMPAIGN })
    .orderBy('updatedAt', 'DESC');

  return result.map((row) => new DetachedAssessment(row));
};

export { getByCampaignIdAndCampaignParticipationId, getDetachedByUserId };

function _assessmentRankByCreationDate(knexConn) {
  return knexConn.raw('ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ?? DESC) AS rank', [
    'assessments.campaignParticipationId',
    'assessments.createdAt',
  ]);
}
