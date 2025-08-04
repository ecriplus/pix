import { CampaignAnalysis } from '../../../campaign/domain/read-models/CampaignAnalysis.js';
import * as knowledgeElementSnapshotRepository from '../../../campaign/infrastructure/repositories/knowledge-element-snapshot-repository.js';

const getCampaignParticipationAnalysis = async function (
  campaignId,
  campaignParticipation,
  campaignLearningContent,
  tutorials,
) {
  const campaignAnalysis = new CampaignAnalysis({
    campaignId,
    campaignLearningContent,
    tutorials,
    participantCount: 1,
  });

  const snapshot = await knowledgeElementSnapshotRepository.findByCampaignParticipationIds([campaignParticipation.id]);

  const knowledgeElementsByTube = campaignLearningContent.getValidatedKnowledgeElementsGroupedByTube(
    snapshot[campaignParticipation.id],
  );
  campaignAnalysis.addToTubeRecommendations({ knowledgeElementsByTube });

  campaignAnalysis.finalize(1);
  return campaignAnalysis;
};

export { getCampaignParticipationAnalysis };
