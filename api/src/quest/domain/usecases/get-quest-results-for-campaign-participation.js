const getEligibilityForThisCampaignParticipation = async (eligibilityRepository, userId, campaignParticipationId) => {
  const eligibilities = await eligibilityRepository.find({ userId });
  return eligibilities.find((e) => e.hasCampaignParticipation(campaignParticipationId));
};

const getTargetProfileRequirementsPerQuest = (quests) =>
  quests
    .map((quest) => {
      const campaignParticipationsRequirement = quest.eligibilityRequirements.find(
        (requirement) => requirement.type === 'campaignParticipations',
      );
      if (campaignParticipationsRequirement && campaignParticipationsRequirement.data.targetProfileIds)
        return campaignParticipationsRequirement.data.targetProfileIds;
    })
    .filter(Boolean);

/**
 * This function retrieves the target profiles we should use for the current participation.
 * It first retrieves the target profile for the current campaign participation.
 * Then it retrieves the target profile requirements for each quest.
 * It filters the target profile requirements to only keep the ones that contain the target profile for the current participation.
 * It checks if the user has participated in campaigns linked to all the target profiles present in the quest requirements.
 * If the user has participated in campaigns linked to all the target profiles present in the quest requirements, it returns the target profile requirements containing the target profile for the current participation.
 * If not, it returns the target profile for the current participation.
 *
 * @param campaignParticipationRepository
 * @param {number} campaignParticipationId
 * @param {[Quest]} quests
 * @param {Eligibility} eligibility
 * @returns {Promise<[number]>}
 */
const getTargetProfilesForThisCampaignParticipation = async ({
  campaignParticipationRepository,
  campaignParticipationId,
  quests,
  eligibility,
}) => {
  const { targetProfileId: targetProfileForThisParticipation } =
    await campaignParticipationRepository.getCampaignByParticipationId({
      campaignParticipationId,
    });

  const targetProfileRequirementsPerQuest = getTargetProfileRequirementsPerQuest(quests);

  const targetProfileRequirementsContainingTargetProfileForCurrentParticipation =
    targetProfileRequirementsPerQuest.filter((targetProfileIds) =>
      targetProfileIds.includes(targetProfileForThisParticipation),
    );

  const targetProfileRequirementContainingTargetProfileForCurrentParticipationWithParticipationForEveryTargetProfile =
    targetProfileRequirementsContainingTargetProfileForCurrentParticipation.find((targetProfileRequirement) =>
      targetProfileRequirement.every((targetProfileId) =>
        eligibility.hasCampaignParticipationForTargetProfileId(targetProfileId),
      ),
    );

  return (
    targetProfileRequirementContainingTargetProfileForCurrentParticipationWithParticipationForEveryTargetProfile ?? [
      targetProfileForThisParticipation,
    ]
  );
};

export const getQuestResultsForCampaignParticipation = async ({
  userId,
  campaignParticipationId,
  questRepository,
  eligibilityRepository,
  rewardRepository,
  campaignParticipationRepository,
}) => {
  const quests = await questRepository.findAll();

  if (quests.length === 0) {
    return [];
  }

  const eligibility = await getEligibilityForThisCampaignParticipation(
    eligibilityRepository,
    userId,
    campaignParticipationId,
  );

  if (!eligibility) return [];

  const targetProfileIdsForThisCampaignParticipation = await getTargetProfilesForThisCampaignParticipation({
    campaignParticipationRepository,
    campaignParticipationId,
    quests,
    eligibility,
  });

  eligibility.campaignParticipations = targetProfileIdsForThisCampaignParticipation.map((targetProfileId) => ({
    targetProfileId,
  }));

  const questResults = [];
  for (const quest of quests) {
    const isEligibleForQuest = quest.isEligible(eligibility);

    if (!isEligibleForQuest) continue;

    const questResult = await rewardRepository.getByQuestAndUserId({ userId, quest });
    questResults.push(questResult);
  }

  return questResults;
};
