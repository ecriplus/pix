import { knex } from '../../../../../db/knex-database-connection.js';
import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { CampaignParticipationForUserManagement } from '../../domain/models/CampaignParticipationForUserManagement.js';

const findByUserId = async function (userId) {
  const campaignParticipations = await knex('assessments')
    .select({
      id: 'assessments.id',
      campaignParticipationId: 'campaign-participations.id',
      participantExternalId: 'campaign-participations.participantExternalId',
      status: 'campaign-participations.status',
      campaignId: 'campaigns.id',
      campaignCode: 'campaigns.code',
      createdAt: 'assessments.createdAt',
      sharedAt: 'campaign-participations.sharedAt',
      deletedAt: 'campaign-participations.deletedAt',
      updatedAt: 'assessments.updatedAt',
      organizationLearnerFirstName: 'view-active-organization-learners.firstName',
      organizationLearnerLastName: 'view-active-organization-learners.lastName',
    })
    .leftJoin('campaign-participations', 'assessments.campaignParticipationId', 'campaign-participations.id')
    .leftJoin('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .leftJoin(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'campaign-participations.organizationLearnerId',
    )
    .where('assessments.userId', userId)
    .where('assessments.type', Assessment.types.CAMPAIGN)
    .orderBy('campaign-participations.createdAt', 'desc')
    .orderBy('campaignCode', 'asc')
    .orderBy('campaign-participations.sharedAt', 'desc');

  return campaignParticipations.map((attributes) => new CampaignParticipationForUserManagement(attributes));
};

export { findByUserId };
