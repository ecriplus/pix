import { CampaignResultLevelsPerTubesAndCompetences } from '../../../campaign/domain/models/CampaignResultLevelsPerTubesAndCompetences.js';

const getResultLevelsPerTubesAndCompetences = async ({
  campaignParticipationId,
  locale,
  learningContentRepository,
  knowledgeElementSnapshotRepository,
}) => {
  const learningContent = await learningContentRepository.findByCampaignParticipationId(
    campaignParticipationId,
    locale,
  );

  const campaignResult = new CampaignResultLevelsPerTubesAndCompetences({
    id: campaignParticipationId,
    learningContent,
  });

  const knowledgeElementsByParticipation = await knowledgeElementSnapshotRepository.findByCampaignParticipationIds([
    campaignParticipationId,
  ]);
  campaignResult.addKnowledgeElementSnapshots(knowledgeElementsByParticipation);

  return campaignResult;
};

export { getResultLevelsPerTubesAndCompetences };
