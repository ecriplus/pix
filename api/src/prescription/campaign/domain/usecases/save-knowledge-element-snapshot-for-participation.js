import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const saveKnowledgeElementSnapshotForParticipation = withTransaction(async function ({
  userId,
  snappedAt,
  knowledgeElementCollection,
  campaignParticipationId,
  knowledgeElementSnapshotRepository,
}) {
  await knowledgeElementSnapshotRepository.save({
    userId,
    snappedAt,
    snapshot: knowledgeElementCollection.toSnapshot(),
    campaignParticipationId,
  });

  const knowledgeElementSnapshotForParticipations =
    await knowledgeElementSnapshotRepository.findByCampaignParticipationIds([campaignParticipationId]);
  return knowledgeElementSnapshotForParticipations?.[campaignParticipationId];
});
