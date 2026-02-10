import { Progression } from '../../../../evaluation/domain/models/Progression.js';

const getCampaignAssessmentParticipation = async function ({
  campaignId,
  campaignParticipationId,
  campaignRepository,
  campaignAssessmentParticipationRepository,
  badgeAcquisitionRepository,
  stageCollectionRepository,
  campaignParticipationRepository,
  knowledgeElementForParticipationService,
  improvementService,
}) {
  const campaignAssessmentParticipation =
    await campaignAssessmentParticipationRepository.getByCampaignIdAndCampaignParticipationId({
      campaignId,
      campaignParticipationId,
    });

  if (campaignAssessmentParticipation.isShared) {
    const acquiredBadgesByCampaignParticipations =
      await badgeAcquisitionRepository.getAcquiredBadgesByCampaignParticipations({
        campaignParticipationsIds: [campaignParticipationId],
      });
    const badges = acquiredBadgesByCampaignParticipations[campaignAssessmentParticipation.campaignParticipationId];
    campaignAssessmentParticipation.setBadges(badges);

    const stageCollection = await stageCollectionRepository.findStageCollection({ campaignId });
    const reachedStage = stageCollection.getReachedStage(
      campaignAssessmentParticipation.validatedSkillsCount,
      campaignAssessmentParticipation.masteryRate * 100,
    );
    campaignAssessmentParticipation.setStageInfo(reachedStage);
    campaignAssessmentParticipation.setProgression(1);
  } else {
    // this is a big duplicate from get progression. need to be factorize
    const skillIds = await campaignRepository.findSkillIds({ campaignId });
    const knowledgeElements = await knowledgeElementForParticipationService.findUniqByUserOrCampaignParticipationId({
      userId: campaignAssessmentParticipation.userId,
      campaignParticipationId,
      limitDate: null,
    });

    const isRetrying = await campaignParticipationRepository.isRetrying({
      campaignParticipationId,
    });

    const knowledgeElementsForProgression = improvementService.filterKnowledgeElements({
      knowledgeElements,
      isRetrying,
      createdAt: campaignAssessmentParticipation.createdAt,
      isImproving: true,
      isFromCampaign: true,
    });

    const progression = new Progression({
      id: campaignParticipationId,
      skillIds,
      knowledgeElements: knowledgeElementsForProgression,
      isProfileCompleted: false,
    });

    campaignAssessmentParticipation.setProgression(progression.completionRate);
  }

  return campaignAssessmentParticipation;
};

export { getCampaignAssessmentParticipation };
