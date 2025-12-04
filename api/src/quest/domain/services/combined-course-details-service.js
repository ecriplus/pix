import { config } from '../../../shared/config.js';
import { cryptoService } from '../../../shared/domain/services/crypto-service.js';
import { CombinedCourseDetails } from '../models/CombinedCourse.js';
import { DataForQuest } from '../models/DataForQuest.js';

async function getCombinedCourseDetails({
  organizationLearnerId,
  combinedCourseId,
  combinedCourseParticipationRepository,
  combinedCourseRepository,
  campaignRepository,
  questRepository,
  moduleRepository,
  eligibilityRepository,
  recommendedModuleRepository,
}) {
  const combinedCourse = await combinedCourseRepository.getById({ id: combinedCourseId });
  const quest = await questRepository.findById({ questId: combinedCourse.questId });

  const participation = await combinedCourseParticipationRepository.findMostRecentByLearnerId({
    organizationLearnerId,
    combinedCourseId,
  });

  const combinedCourseDetails = new CombinedCourseDetails(combinedCourse, quest, participation);
  const campaignIds = combinedCourseDetails.campaignIds;
  const campaigns = [];
  const targetProfileIds = [];
  for (const campaignId of campaignIds) {
    const campaign = await campaignRepository.get({ id: campaignId });
    campaigns.push(campaign);
    targetProfileIds.push(campaign.targetProfileId);
  }

  let recommendableModuleIds = [];
  if (targetProfileIds.length > 0) {
    recommendableModuleIds = await recommendedModuleRepository.findIdsByTargetProfileIds({
      targetProfileIds,
    });
  }

  const moduleIds = combinedCourseDetails.moduleIds;

  let recommendedModuleIdsForUser = [];
  let dataForQuest;

  if (participation) {
    const eligibility = await eligibilityRepository.findByOrganizationAndOrganizationLearnerId({
      organizationLearnerId,
      organizationId: combinedCourse.organizationId,
      moduleIds,
    });

    dataForQuest = new DataForQuest({ eligibility });

    const campaignParticipationIds = quest.findCampaignParticipationIdsContributingToQuest(dataForQuest);

    if (campaignParticipationIds.length > 0) {
      recommendedModuleIdsForUser = await recommendedModuleRepository.findIdsByCampaignParticipationIds({
        campaignParticipationIds,
      });
    }
  }

  const modules = await moduleRepository.getByIds({ moduleIds });

  const combinedCourseUrl = '/parcours/' + combinedCourseDetails.code;
  const encryptedCombinedCourseUrl = await cryptoService.encrypt(combinedCourseUrl, config.module.secret);
  combinedCourseDetails.generateItems({
    itemDetails: [...campaigns, ...modules],
    recommendableModuleIds,
    recommendedModuleIdsForUser,
    encryptedCombinedCourseUrl,
    dataForQuest,
  });

  return combinedCourseDetails;
}

export default { getCombinedCourseDetails };
