import { CombinedCourseDetails } from '../models/CombinedCourse.js';
import { DataForQuest } from '../models/DataForQuest.js';

async function instantiateCombinedCourseDetails({
  combinedCourseId,
  combinedCourseRepository,
  campaignRepository,
  questRepository,
  recommendedModuleRepository,
  moduleRepository,
}) {
  const combinedCourse = await combinedCourseRepository.getById({ id: combinedCourseId });
  const quest = await questRepository.findById({ questId: combinedCourse.questId });

  const combinedCourseDetails = new CombinedCourseDetails(combinedCourse, quest);
  await combinedCourseDetails.setEncryptedUrl();
  const campaignIds = combinedCourseDetails.campaignIds;
  const campaigns = [];
  const targetProfileIds = [];
  for (const campaignId of campaignIds) {
    const campaign = await campaignRepository.get({ id: campaignId });
    campaigns.push(campaign);
    targetProfileIds.push(campaign.targetProfileId);
  }

  const modules = await moduleRepository.getByIds({ moduleIds: combinedCourseDetails.moduleIds });

  combinedCourseDetails.setItems({ campaigns, modules });

  let recommendableModuleIds = [];
  if (targetProfileIds.length > 0) {
    recommendableModuleIds = await recommendedModuleRepository.findIdsByTargetProfileIds({
      targetProfileIds,
    });
  }

  combinedCourseDetails.setRecommandableModuleIds(recommendableModuleIds);

  return combinedCourseDetails;
}

async function getCombinedCourseDetails({
  combinedCourseDetails,
  organizationLearnerId,
  combinedCourseParticipationRepository,
  eligibilityRepository,
  recommendedModuleRepository,
}) {
  const participation = await combinedCourseParticipationRepository.findByLearnerId({
    organizationLearnerId,
    combinedCourseId: combinedCourseDetails.id,
  });

  let recommendedModuleIdsForUser = [];
  let dataForQuest;

  if (participation) {
    const eligibility = await eligibilityRepository.findByOrganizationAndOrganizationLearnerId({
      organizationLearnerId,
      organizationId: combinedCourseDetails.organizationId,
      moduleIds: combinedCourseDetails.moduleIds,
    });

    dataForQuest = new DataForQuest({ eligibility });

    const campaignParticipationIds =
      combinedCourseDetails.quest.findCampaignParticipationIdsContributingToQuest(dataForQuest);

    if (campaignParticipationIds.length > 0) {
      recommendedModuleIdsForUser = await recommendedModuleRepository.findIdsByCampaignParticipationIds({
        campaignParticipationIds,
      });
    }
  }

  combinedCourseDetails.generateItems({
    participation,
    recommendedModuleIdsForUser,
    dataForQuest,
  });

  return combinedCourseDetails;
}

export default { instantiateCombinedCourseDetails, getCombinedCourseDetails };
