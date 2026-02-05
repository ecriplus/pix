import { CampaignParticipationStatuses } from '../../../shared/domain/constants.js';

export const getOrganizationLearnerWithParticipations = async function ({
  organizationId,
  organizationLearnerId,
  organizationRepository,
  campaignParticipationOverviewRepository,
  tagRepository,
  stageRepository,
  stageAcquisitionRepository,
  stageAcquisitionComparisonService,
}) {
  const organization = await organizationRepository.get(organizationId);
  const campaignParticipationOverviews = await campaignParticipationOverviewRepository.findByOrganizationLearnerId({
    organizationLearnerId,
  });

  const campaignParticipationIds = [];
  const targetProfileIdsSet = new Set();

  for (const campaignParticipationOverview of campaignParticipationOverviews) {
    if (campaignParticipationOverview.status === CampaignParticipationStatuses.SHARED) {
      campaignParticipationIds.push(campaignParticipationOverview.id);
      targetProfileIdsSet.add(campaignParticipationOverview.targetProfileId);
    }
  }

  const targetProfileIds = [...targetProfileIdsSet];

  const stages = await stageRepository.getByTargetProfileIds(targetProfileIds);
  const acquiredStages = await stageAcquisitionRepository.getByCampaignParticipations(campaignParticipationIds);

  const campaignParticipationOverviewsWithStages = campaignParticipationOverviews.map(
    (campaignParticipationOverview) => {
      const stagesForThisCampaign = stages.filter(
        ({ targetProfileId }) => targetProfileId === campaignParticipationOverview.targetProfileId,
      );
      const acquiredStagesForThisCampaign = acquiredStages.filter(
        ({ campaignParticipationId }) => campaignParticipationId === campaignParticipationOverview.id,
      );
      const stagesComparison = stageAcquisitionComparisonService.compare(
        stagesForThisCampaign,
        acquiredStagesForThisCampaign,
      );

      campaignParticipationOverview.stagesStatus = {
        totalStages: stagesComparison.totalNumberOfStages,
        reachedStages: stagesComparison.reachedStageNumber,
      };

      return campaignParticipationOverview;
    },
  );

  const tags = await tagRepository.findByIds(organization.tags.map((tag) => tag.id));

  return {
    organizationLearner: { id: organizationLearnerId },
    organization,
    campaignParticipations: campaignParticipationOverviewsWithStages,
    tagNames: tags.map((tag) => tag.name),
  };
};
