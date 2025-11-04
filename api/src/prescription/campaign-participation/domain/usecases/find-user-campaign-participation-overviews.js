const findUserCampaignParticipationOverviews = async function ({
  userId,
  states,
  stageRepository,
  stageAcquisitionRepository,
  campaignParticipationOverviewRepository,
  compareStagesAndAcquiredStages,
}) {
  const concatenatedStates = states ? [].concat(states) : undefined;

  const campaignParticipationOverviews = await campaignParticipationOverviewRepository.findByUserIdWithFilters({
    userId,
    states: concatenatedStates,
  });
  // We deduplicate targetProfileIds in the case where several campaigns belong to the same target profile
  const targetProfileIds = [
    ...new Set(
      campaignParticipationOverviews
        .filter((participation) => participation.campaignType !== 'COMBINED_COURSE')
        .map(({ targetProfileId }) => targetProfileId),
    ),
  ];
  const campaignParticipationIds = campaignParticipationOverviews.map(({ id }) => id);

  const [stages, acquiredStages] = await Promise.all([
    stageRepository.getByTargetProfileIds(targetProfileIds),
    stageAcquisitionRepository.getByCampaignParticipations(campaignParticipationIds),
  ]);

  const campaignParticipationOverviewsWithStages = campaignParticipationOverviews.map(
    (campaignParticipationOverview) => {
      const stagesForThisCampaign = stages.filter(
        ({ targetProfileId }) => targetProfileId === campaignParticipationOverview.targetProfileId,
      );
      const acquiredStagesForThisCampaign = acquiredStages.filter(
        ({ campaignParticipationId }) => campaignParticipationId === campaignParticipationOverview.id,
      );
      const stagesComparison = compareStagesAndAcquiredStages.compare(
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

  return campaignParticipationOverviewsWithStages;
};

export { findUserCampaignParticipationOverviews };
