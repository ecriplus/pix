import { CampaignParticipationStatuses } from '../../../shared/domain/constants.js';
import { CampaignResultLevelsPerTubesAndCompetences } from '../models/CampaignResultLevelsPerTubesAndCompetences.js';
import {
  AssessmentCampaignParticipation,
  ProfilesCollectionCampaignParticipation,
  TubeCoverage,
} from '../read-models/CampaignParticipation.js';

const getCampaignParticipations = async function ({
  campaignId,
  locale,
  campaignRepository,
  campaignParticipationRepository,
  knowledgeElementSnapshotRepository,
  learningContentRepository,
}) {
  const campaign = await campaignRepository.get(campaignId);
  const participations = await campaignParticipationRepository.findInfoByCampaignId(campaignId);

  if (campaign.isProfilesCollection) {
    return participations.map((participation) => {
      return new ProfilesCollectionCampaignParticipation(participation);
    });
  }

  const learningContent = await learningContentRepository.findByCampaignId(campaignId, locale);
  const knowledgeElementsByParticipations = await knowledgeElementSnapshotRepository.findByCampaignParticipationIds(
    participations.map((participation) => participation.id),
  );
  return participations.map((participation) => {
    const tubes = computeTubes(campaignId, participation, learningContent, {
      [participation.id]: knowledgeElementsByParticipations[participation.id],
    });
    return new AssessmentCampaignParticipation({ ...participation, tubes });
  });
};

function computeTubes(campaignId, campaignParticipation, learningContent, knowledgeElementsByParticipation) {
  if (campaignParticipation.status !== CampaignParticipationStatuses.SHARED) {
    return undefined;
  }

  const campaignResultLevelPerTubesAndCompetences = new CampaignResultLevelsPerTubesAndCompetences({
    campaignId,
    learningContent,
    knowledgeElementsByParticipation,
  });
  return campaignResultLevelPerTubesAndCompetences.levelsPerTube.map(({ meanLevel, ...tube }) => {
    return new TubeCoverage({
      ...tube,
      reachedLevel: meanLevel,
    });
  });
}

export { getCampaignParticipations };
