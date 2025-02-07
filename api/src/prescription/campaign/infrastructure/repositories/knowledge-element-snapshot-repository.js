import { knex } from '../../../../../db/knex-database-connection.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { AlreadyExistingEntityError } from '../../../../shared/domain/errors.js';
import { KnowledgeElement } from '../../../../shared/domain/models/KnowledgeElement.js';
import * as knexUtils from '../../../../shared/infrastructure/utils/knex-utils.js';
import { CampaignParticipationKnowledgeElementSnapshots } from '../../../shared/domain/read-models/CampaignParticipationKnowledgeElementSnapshots.js';

const save = async function ({ userId, snappedAt, knowledgeElements, campaignParticipationId }) {
  try {
    const knexConn = DomainTransaction.getConnection();
    return await knexConn('knowledge-element-snapshots').insert({
      userId,
      snappedAt,
      snapshot: JSON.stringify(knowledgeElements),
      campaignParticipationId,
    });
  } catch (error) {
    if (knexUtils.isUniqConstraintViolated(error)) {
      throw new AlreadyExistingEntityError(
        `A snapshot already exists for the user ${userId} at the datetime ${snappedAt}.`,
      );
    }
  }
};

/**
 * @function
 * @name findCampaignParticipationKnowledgeElementSnapshots
 *
 * @param {number[]} campaignParticipationIds
 * @returns {Promise<Array<CampaignParticipationKnowledgeElementSnapshots>>}
 */
const findCampaignParticipationKnowledgeElementSnapshots = async function (campaignParticipationIds) {
  const knowledgeElementsByCampaignParticipation = await findByCampaignParticipationIds(campaignParticipationIds);
  return campaignParticipationIds.map(
    (campaignParticipationId) =>
      new CampaignParticipationKnowledgeElementSnapshots({
        knowledgeElements: knowledgeElementsByCampaignParticipation[campaignParticipationId],
        campaignParticipationId: campaignParticipationId,
      }),
  );
};

/**
 *
 * @param {number[]} campaignParticipationIds
 * @returns {Object.<number, KnowledgeElement[]>}
 */
const findByCampaignParticipationIds = async function (campaignParticipationIds) {
  const results = await knex
    .select('campaignParticipationId', 'snapshot')
    .from('knowledge-element-snapshots')
    .whereIn('campaignParticipationId', campaignParticipationIds);

  return Object.fromEntries(
    results.map(({ campaignParticipationId, snapshot }) => [
      campaignParticipationId,
      snapshot.map(({ createdAt, ...data }) => {
        return new KnowledgeElement({ ...data, createdAt: new Date(createdAt) });
      }),
    ]),
  );
};

export { findByCampaignParticipationIds, findCampaignParticipationKnowledgeElementSnapshots, save };
