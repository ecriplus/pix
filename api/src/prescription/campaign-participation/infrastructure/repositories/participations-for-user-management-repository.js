import { knex } from '../../../../../db/knex-database-connection.js';
import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { CampaignTypes } from '../../../shared/domain/constants.js';
import { CampaignParticipationForUserManagement } from '../../domain/models/CampaignParticipationForUserManagement.js';

const findByUserId = async function (userId) {
  const campaignParticipations = await knex('assessments')
    .select({
      campaignParticipationId: 'campaign-participations.id',
      participantExternalId: 'campaign-participations.participantExternalId',
      status: 'campaign-participations.status',
      campaignId: 'campaigns.id',
      campaignCode: 'campaigns.code',
      createdAt: knex.raw('COALESCE("campaign-participations"."createdAt", assessments."createdAt")'),
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
    .union(function () {
      this.select({
        campaignParticipationId: 'campaign-participations.id',
        participantExternalId: 'campaign-participations.participantExternalId',
        status: 'campaign-participations.status',
        campaignId: 'campaigns.id',
        campaignCode: 'campaigns.code',
        createdAt: 'campaign-participations.createdAt',
        sharedAt: 'campaign-participations.sharedAt',
        deletedAt: 'campaign-participations.deletedAt',
        updatedAt: 'campaign-participations.deletedAt',
        organizationLearnerFirstName: 'view-active-organization-learners.firstName',
        organizationLearnerLastName: 'view-active-organization-learners.lastName',
      })
        .from('campaign-participations')
        .leftJoin('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
        .leftJoin(
          'view-active-organization-learners',
          'view-active-organization-learners.id',
          'campaign-participations.organizationLearnerId',
        )
        .where({ 'campaign-participations.userId': userId, type: CampaignTypes.PROFILES_COLLECTION });
    })
    .orderBy('createdAt', 'desc')
    .orderBy('campaignCode', 'asc')
    .orderBy('sharedAt', 'desc');

  return campaignParticipations.map((attributes) => new CampaignParticipationForUserManagement(attributes));
};

export { findByUserId };
