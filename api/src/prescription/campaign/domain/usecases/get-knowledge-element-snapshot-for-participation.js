export async function getKnowledgeElementSnapshotForParticipation({
  campaignParticipationId,
  knowledgeElementSnapshotRepository,
}) {
  const knowledgeElementSnapshotForParticipations =
    await knowledgeElementSnapshotRepository.findByCampaignParticipationIds([campaignParticipationId]);
  return knowledgeElementSnapshotForParticipations?.[campaignParticipationId] ?? null;
}
