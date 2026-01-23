import * as stageAndStageAcquisitionComparisonService from '../../../../evaluation/domain/services/stages/stage-and-stage-acquisition-comparison-service.js';
import { CampaignParticipationStatuses } from '../../../shared/domain/constants.js';
import { CampaignResultLevelsPerTubesAndCompetences } from '../models/CampaignResultLevelsPerTubesAndCompetences.js';
import {
  AssessmentCampaignParticipation,
  Badge,
  ProfilesCollectionCampaignParticipation,
  TubeCoverage,
} from '../read-models/CampaignParticipation.js';

const getStagesAndStageAcquisitions = async (
  stageRepository,
  campaignId,
  stageAcquisitionRepository,
  participationIds,
) => {
  const stages = await stageRepository.getByCampaignId(campaignId);
  const stageAcquisitions = stages.length
    ? await stageAcquisitionRepository.getByCampaignParticipations(participationIds)
    : [];
  const acquiredStagesByParticipation = stageAcquisitions.reduce((acquiredStagesByParticipation, acquisition) => {
    if (!acquiredStagesByParticipation[acquisition.campaignParticipationId]) {
      acquiredStagesByParticipation[acquisition.campaignParticipationId] = [];
    }
    acquiredStagesByParticipation[acquisition.campaignParticipationId].push(acquisition);
    return acquiredStagesByParticipation;
  }, {});
  return { stages, acquiredStagesByParticipation };
};

const getBadgesWithBadgesCalculationAndBadgesAcquisitions = async ({
  campaignId,
  participationIds,
  badgeRepository,
  badgeForCalculationRepository,
  badgeAcquisitionRepository,
}) => {
  const badges = await badgeRepository.findByCampaignId(campaignId);
  const badgesForCalculation = await badgeForCalculationRepository.findByCampaignId({ campaignId });
  const badgeAcquisitions =
    await badgeAcquisitionRepository.getAcquiredBadgesForCampaignParticipations(participationIds);
  const acquiredBadgesByParticipation = badgeAcquisitions.reduce((acquiredBadgesByParticipation, acquisition) => {
    if (!acquiredBadgesByParticipation[acquisition.campaignParticipationId]) {
      acquiredBadgesByParticipation[acquisition.campaignParticipationId] = [];
    }
    acquiredBadgesByParticipation[acquisition.campaignParticipationId].push(acquisition);
    return acquiredBadgesByParticipation;
  }, {});
  return { badges, badgesForCalculation, acquiredBadgesByParticipation };
};

const computeTubes = (campaignId, campaignParticipation, learningContent, knowledgeElementsByParticipation) => {
  if (campaignParticipation.status !== CampaignParticipationStatuses.SHARED) {
    return;
  }

  const campaignResultLevelPerTubesAndCompetences = new CampaignResultLevelsPerTubesAndCompetences({
    campaignId,
    learningContent,
  });

  campaignResultLevelPerTubesAndCompetences.addKnowledgeElementSnapshots(knowledgeElementsByParticipation);

  return campaignResultLevelPerTubesAndCompetences.levelsPerTube.map((tube) => {
    return new TubeCoverage({
      ...tube,
      reachedLevel: tube.meanLevel,
    });
  });
};

export const getCampaignParticipations = async function ({
  campaignId,
  locale,
  page,
  since,
  campaignRepository,
  badgeRepository,
  badgeForCalculationRepository,
  badgeAcquisitionRepository,
  stageRepository,
  stageAcquisitionRepository,
  campaignParticipationRepository,
  knowledgeElementSnapshotRepository,
  learningContentRepository,
}) {
  const campaign = await campaignRepository.get(campaignId);
  const { models: participations, meta } = await campaignParticipationRepository.findInfoByCampaignId({
    campaignId,
    page,
    since,
  });
  const participationIds = participations.map(({ id }) => id);

  if (campaign.isProfilesCollection) {
    return {
      models: participations.map((participation) => {
        return new ProfilesCollectionCampaignParticipation(participation);
      }),
      meta,
    };
  }
  const { stages, acquiredStagesByParticipation } = await getStagesAndStageAcquisitions(
    stageRepository,
    campaignId,
    stageAcquisitionRepository,
    participationIds,
  );

  const { badges, badgesForCalculation, acquiredBadgesByParticipation } =
    await getBadgesWithBadgesCalculationAndBadgesAcquisitions({
      campaignId,
      badgeRepository,
      badgeForCalculationRepository,
      badgeAcquisitionRepository,
      participationIds,
    });

  const learningContent = await learningContentRepository.findByCampaignId(campaignId, locale);
  const knowledgeElementsByParticipations = await knowledgeElementSnapshotRepository.findByCampaignParticipationIds(
    participations.map((participation) => participation.id),
  );

  return {
    models: participations.map((participation) => {
      const tubes = computeTubes(campaignId, participation, learningContent, {
        [participation.id]: knowledgeElementsByParticipations[participation.id],
      });

      const acquiredStagesForParticipation = acquiredStagesByParticipation[participation.id] || [];

      const { reachedStageNumber } = stageAndStageAcquisitionComparisonService.compare(
        stages,
        acquiredStagesForParticipation,
      );

      const badgesAcquisitionsForParticipation = acquiredBadgesByParticipation[participation.id] || [];

      return new AssessmentCampaignParticipation({
        ...participation,
        tubes,
        stages: {
          reachedStage: reachedStageNumber === 0 ? 0 : reachedStageNumber - 1, // exclude stage 0
          numberOfStages: stages.length === 0 ? 0 : stages.length - 1, // exclude stage 0
        },
        badges: badges.map((badge) => {
          // TODO PIX-21173 Create dedicated repository or service for badges to remove logic duplication for acquisition percentage
          const isAcquired = badgesAcquisitionsForParticipation.some(({ badgeId }) => badgeId === badge.id);

          const acquisitionPercentage = getAcquisitionPercentage(
            participation,
            badge,
            isAcquired,
            badgesForCalculation,
            knowledgeElementsByParticipations,
          );

          return new Badge({
            ...badge,
            isAcquired,
            acquisitionPercentage,
          });
        }),
      });
    }),
    meta,
  };
};

function getAcquisitionPercentage(
  participation,
  badge,
  isAcquired,
  badgesForCalculation,
  knowledgeElementsByParticipations,
) {
  if (participation.status !== CampaignParticipationStatuses.SHARED) return 0;
  if (isAcquired) return 100;
  return badgesForCalculation
    .find((badgeForCalculation) => badgeForCalculation.id === badge.id)
    .getAcquisitionPercentage(knowledgeElementsByParticipations[participation.id] ?? []);
}
