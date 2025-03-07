import _ from 'lodash';

import { knex } from '../../../../db/knex-database-connection.js';
import * as campaignRepository from '../../../prescription/campaign/infrastructure/repositories/campaign-repository.js';
import { KnowledgeElementCollection } from '../../../prescription/shared/domain/models/KnowledgeElementCollection.js';
import { DomainTransaction } from '../../domain/DomainTransaction.js';
import { KnowledgeElement } from '../../domain/models/KnowledgeElement.js';
import { logger } from '../utils/logger.js';

const tableName = 'knowledge-elements';

function _findByUserIdAndLimitDateQuery({ userId, limitDate, skillIds = [] }) {
  const knexConn = DomainTransaction.getConnection();
  return knexConn(tableName).where((qb) => {
    qb.where({ userId });
    if (limitDate) {
      qb.where('createdAt', '<', limitDate);
    }
    if (skillIds.length) {
      qb.whereIn('skillId', skillIds);
    }
  });
}

async function findAssessedByUserIdAndLimitDateQuery({ userId, limitDate, skillIds }) {
  const knowledgeElementRows = await _findByUserIdAndLimitDateQuery({ userId, limitDate, skillIds });

  const keCollection = new KnowledgeElementCollection(
    knowledgeElementRows.map((knowledgeElementRow) => new KnowledgeElement(knowledgeElementRow)),
  );
  return keCollection.latestUniqNonResetKnowledgeElements;
}

const findUniqByUserIds = async function ({ userIds }) {
  const results = [];
  for (const userId of userIds) {
    const knowledgeElements = await findAssessedByUserIdAndLimitDateQuery({
      userId,
    });

    results.push({ userId, knowledgeElements });
  }
  return results;
};

const batchSave = async function ({ knowledgeElements }) {
  const knexConn = DomainTransaction.getConnection();
  const knowledgeElementsToSave = knowledgeElements.map((ke) => _.omit(ke, ['id', 'createdAt']));
  const savedKnowledgeElements = await knex
    .batchInsert(tableName, knowledgeElementsToSave)
    .transacting(knexConn.isTransaction ? knexConn : null)
    .returning('*');
  return savedKnowledgeElements.map((ke) => new KnowledgeElement(ke));
};

const saveForCampaignParticipation = async function ({ knowledgeElements, campaignParticipationId }) {
  const knexConn = DomainTransaction.getConnection();
  const campaign = await _getAssociatedCampaign(campaignParticipationId);
  if (!campaign) {
    return [];
  }
  if (campaign.isAssessment || campaign.isExam) {
    const knowledgeElementsToSave = knowledgeElements.map((ke) => _.omit(ke, ['id', 'createdAt']));
    const savedKnowledgeElements = await knex
      .batchInsert(tableName, knowledgeElementsToSave)
      .transacting(knexConn.isTransaction ? knexConn : null)
      .returning('*');
    return savedKnowledgeElements.map((ke) => new KnowledgeElement(ke));
  }
  return [];
};

const findUniqByUserId = function ({ userId, limitDate, skillIds }) {
  return findAssessedByUserIdAndLimitDateQuery({ userId, limitDate, skillIds });
};

const findUniqByUserIdAndAssessmentId = async function ({ userId, assessmentId }) {
  const query = _findByUserIdAndLimitDateQuery({ userId });
  const knowledgeElementRows = await query.where({ assessmentId });

  const keCollection = new KnowledgeElementCollection(
    knowledgeElementRows.map((knowledgeElementRow) => new KnowledgeElement(knowledgeElementRow)),
  );
  return keCollection.latestUniqNonResetKnowledgeElements;
};

const findUniqByUserIdAndCompetenceId = async function ({ userId, competenceId }) {
  const knowledgeElements = await findAssessedByUserIdAndLimitDateQuery({ userId });
  return knowledgeElements.filter((knowledgeElement) => knowledgeElement.competenceId === competenceId);
};

const findUniqByUserIdGroupedByCompetenceId = async function ({ userId, limitDate }) {
  const knowledgeElements = await this.findUniqByUserId({ userId, limitDate });
  return _.groupBy(knowledgeElements, 'competenceId');
};

const findInvalidatedAndDirectByUserId = async function (userId) {
  const invalidatedKnowledgeElements = await knex(tableName)
    .where({
      userId,
      status: KnowledgeElement.StatusType.INVALIDATED,
      source: KnowledgeElement.SourceType.DIRECT,
    })
    .orderBy('createdAt', 'desc');

  if (!invalidatedKnowledgeElements.length) {
    return [];
  }

  return invalidatedKnowledgeElements.map(
    (invalidatedKnowledgeElement) => new KnowledgeElement(invalidatedKnowledgeElement),
  );
};

async function _getAssociatedCampaign(campaignParticipationId) {
  let campaign = null;
  if (!campaignParticipationId) {
    return campaign;
  }
  try {
    const campaignId = await campaignRepository.getCampaignIdByCampaignParticipationId(campaignParticipationId);
    campaign = await campaignRepository.get(campaignId);
  } catch (err) {
    logger.error(err);
    return null;
  }
  return campaign;
}

export {
  batchSave,
  findAssessedByUserIdAndLimitDateQuery,
  findInvalidatedAndDirectByUserId,
  findUniqByUserId,
  findUniqByUserIdAndAssessmentId,
  findUniqByUserIdAndCompetenceId,
  findUniqByUserIdGroupedByCompetenceId,
  findUniqByUserIds,
  saveForCampaignParticipation,
};
