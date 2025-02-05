import lodash from 'lodash';

import { knex } from '../../../../../db/knex-database-connection.js';
import { constants } from '../../../../shared/domain/constants.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { Campaign } from '../../../../shared/domain/models/Campaign.js';
import * as knowledgeElementRepository from '../../../../shared/infrastructure/repositories/knowledge-element-repository.js';
import * as knowledgeElementSnapshotRepository from '../../../campaign/infrastructure/repositories/knowledge-element-snapshot-repository.js';
import { CampaignParticipationStatuses, CampaignTypes } from '../../../shared/domain/constants.js';
import { KnowledgeElementCollection } from '../../../shared/domain/models/KnowledgeElementCollection.js';
import { CampaignParticipation } from '../../domain/models/CampaignParticipation.js';
import { AvailableCampaignParticipation } from '../../domain/read-models/AvailableCampaignParticipation.js';

const { TO_SHARE } = CampaignParticipationStatuses;

const { pick } = lodash;

const CAMPAIGN_PARTICIPATION_ATTRIBUTES = [
  'participantExternalId',
  'sharedAt',
  'status',
  'userId',
  'organizationLearnerId',
  'deletedAt',
  'deletedBy',
];

const updateWithSnapshot = async function (campaignParticipation) {
  await this.update(campaignParticipation);

  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({
    userId: campaignParticipation.userId,
    limitDate: campaignParticipation.sharedAt,
  });
  await knowledgeElementSnapshotRepository.save({
    userId: campaignParticipation.userId,
    snappedAt: campaignParticipation.sharedAt,
    snapshot: new KnowledgeElementCollection(knowledgeElements).toSnapshot(),
    campaignParticipationId: campaignParticipation.id,
  });
};

const update = async function (campaignParticipation) {
  const knexConn = DomainTransaction.getConnection();

  await knexConn('campaign-participations')
    .where({ id: campaignParticipation.id })
    .update(pick(campaignParticipation, CAMPAIGN_PARTICIPATION_ATTRIBUTES));
};

const batchUpdate = async function (campaignParticipations) {
  return Promise.all(campaignParticipations.map((campaignParticipation) => update(campaignParticipation)));
};

const get = async function (id) {
  const knexConn = DomainTransaction.getConnection();

  const campaignParticipation = await knexConn.from('campaign-participations').where({ id }).first();
  const campaign = await knexConn.from('campaigns').where({ id: campaignParticipation.campaignId }).first();
  const assessments = await knexConn.from('assessments').where({ campaignParticipationId: id });

  return new CampaignParticipation({
    ...campaignParticipation,
    campaign: new Campaign(campaign),
    assessments: assessments.map((assessment) => new Assessment(assessment)),
  });
};

const getByCampaignIds = async function (campaignIds) {
  const knexConn = DomainTransaction.getConnection();
  const campaignParticipations = await knexConn('campaign-participations')
    .whereNull('deletedAt')
    .whereIn('campaignId', campaignIds);
  return campaignParticipations.map((campaignParticipation) => new CampaignParticipation(campaignParticipation));
};

const getAllCampaignParticipationsInCampaignForASameLearner = async function ({ campaignId, campaignParticipationId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn('campaign-participations')
    .select('organizationLearnerId')
    .where({ id: campaignParticipationId, campaignId })
    .first();

  if (!result) {
    throw new NotFoundError(
      `There is no campaign participation with the id "${campaignParticipationId}" for the campaign wih the id "${campaignId}"`,
    );
  }

  const campaignParticipations = await knexConn('campaign-participations')
    .where({
      campaignId,
      organizationLearnerId: result.organizationLearnerId,
    })
    .whereNull('deletedAt')
    .whereNull('deletedBy');

  return campaignParticipations.map((campaignParticipation) => new CampaignParticipation(campaignParticipation));
};

const getCampaignParticipationsForOrganizationLearner = async function ({ organizationLearnerId, campaignId }) {
  const campaignParticipations = await knex('campaign-participations')
    .where({
      campaignId,
      organizationLearnerId,
    })
    .whereNull('deletedAt')
    .whereNull('deletedBy')
    .orderBy('createdAt', 'desc');

  return campaignParticipations.map(
    (campaignParticipation) => new AvailableCampaignParticipation(campaignParticipation),
  );
};

const remove = async function ({ id, deletedAt, deletedBy }) {
  const knexConn = DomainTransaction.getConnection();
  return await knexConn('campaign-participations').where({ id }).update({ deletedAt, deletedBy });
};

const findProfilesCollectionResultDataByCampaignId = async function (campaignId) {
  const results = await knex('campaign-participations')
    .select([
      'campaign-participations.*',
      'view-active-organization-learners.studentNumber',
      'view-active-organization-learners.division',
      'view-active-organization-learners.group',
      'view-active-organization-learners.firstName',
      'view-active-organization-learners.lastName',
      'view-active-organization-learners.attributes',
    ])
    .join(
      'view-active-organization-learners',
      'view-active-organization-learners.id',
      'campaign-participations.organizationLearnerId',
    )
    .where({ campaignId, 'campaign-participations.deletedAt': null })
    .orderBy('lastName', 'ASC')
    .orderBy('firstName', 'ASC')
    .orderBy('createdAt', 'DESC');

  return results.map(_rowToResult);
};

const findOneByCampaignIdAndUserId = async function ({ campaignId, userId }) {
  const campaignParticipation = await knex('campaign-participations')
    .where({ userId, isImproved: false, campaignId })
    .first();
  if (!campaignParticipation) return null;
  const assessments = await knex('assessments').where({ campaignParticipationId: campaignParticipation.id });
  return new CampaignParticipation({
    ...campaignParticipation,
    assessments: assessments.map((assessment) => new Assessment(assessment)),
  });
};

const hasAssessmentParticipations = async function (userId) {
  const { count } = await knex('campaign-participations')
    .count('campaign-participations.id')
    .join('campaigns', 'campaigns.id', 'campaignId')
    .whereNot('campaigns.organizationId', constants.AUTONOMOUS_COURSES_ORGANIZATION_ID)
    .where('campaigns.type', '=', CampaignTypes.ASSESSMENT)
    .andWhere({ userId })
    .first();
  return count > 0;
};

const getCodeOfLastParticipationToProfilesCollectionCampaignForUser = async function (userId) {
  const result = await knex('campaign-participations')
    .select('campaigns.code')
    .join('campaigns', 'campaigns.id', 'campaignId')
    .where({ userId })
    .whereNull('campaign-participations.deletedAt')
    .whereNull('archivedAt')
    .andWhere({ status: TO_SHARE })
    .andWhere({ 'campaigns.type': CampaignTypes.PROFILES_COLLECTION })
    .orderBy('campaign-participations.createdAt', 'desc')
    .first();
  return result?.code || null;
};

const isRetrying = async function ({ campaignParticipationId }) {
  const { id: campaignId, userId } = await knex('campaigns')
    .select('campaigns.id', 'userId')
    .join('campaign-participations', 'campaigns.id', 'campaignId')
    .where({ 'campaign-participations.id': campaignParticipationId })
    .first();

  const campaignParticipations = await knex('campaign-participations')
    .select('sharedAt', 'isImproved')
    .where({ campaignId, userId });

  return (
    campaignParticipations.length > 1 &&
    campaignParticipations.some((participation) => !participation.isImproved && !participation.sharedAt)
  );
};

function _rowToResult(row) {
  return {
    id: row.id,
    createdAt: new Date(row.createdAt),
    isShared: row.status === CampaignParticipationStatuses.SHARED,
    sharedAt: row.sharedAt ? new Date(row.sharedAt) : null,
    participantExternalId: row.participantExternalId,
    userId: row.userId,
    isCompleted: row.state === 'completed',
    studentNumber: row.studentNumber,
    participantFirstName: row.firstName,
    participantLastName: row.lastName,
    division: row.division,
    additionalInfos: row.attributes,
    pixScore: row.pixScore,
    group: row.group,
  };
}

export {
  batchUpdate,
  findOneByCampaignIdAndUserId,
  findProfilesCollectionResultDataByCampaignId,
  get,
  getAllCampaignParticipationsInCampaignForASameLearner,
  getByCampaignIds,
  getCampaignParticipationsForOrganizationLearner,
  getCodeOfLastParticipationToProfilesCollectionCampaignForUser,
  hasAssessmentParticipations,
  isRetrying,
  remove,
  update,
  updateWithSnapshot,
};
