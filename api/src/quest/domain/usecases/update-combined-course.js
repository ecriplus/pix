import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourseDetails } from '../models/CombinedCourse.js';
import { DataForQuest } from '../models/DataForQuest.js';

export const updateCombinedCourse = withTransaction(
  async ({
    userId,
    code,
    combinedCourseRepository,
    combinedCourseParticipationRepository,
    questRepository,
    eligibilityRepository,
    campaignRepository,
    recommendedModulesRepository,
    organizationLearnerPassageParticipationRepository,
  }) => {
    const combinedCourse = await combinedCourseRepository.getByCode({ code });
    const quest = await questRepository.getByCode({ code });

    let combinedCourseParticipation;
    try {
      combinedCourseParticipation = await combinedCourseParticipationRepository.getByUserId({
        questId: quest.id,
        userId,
      });
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
    }

    if (!combinedCourseParticipation || combinedCourseParticipation.isCompleted()) {
      return;
    }

    const combinedCourseDetails = new CombinedCourseDetails(combinedCourse, quest, combinedCourseParticipation);

    const eligibility = await eligibilityRepository.findByUserIdAndOrganizationId({
      userId,
      organizationId: combinedCourse.organizationId,
      moduleIds: combinedCourseDetails.moduleIds,
    });

    const dataForQuest = new DataForQuest({ eligibility });

    const campaignParticipationIds = quest.findCampaignParticipationIdsContributingToQuest(dataForQuest);

    const campaignIds = combinedCourseDetails.campaignIds;
    const targetProfileIds = [];
    for (const campaignId of campaignIds) {
      const campaign = await campaignRepository.get({ id: campaignId });
      targetProfileIds.push(campaign.targetProfileId);
    }

    let recommendableModules = [];
    if (targetProfileIds.length > 0) {
      recommendableModules = await recommendedModulesRepository.findIdsByTargetProfileIds({
        targetProfileIds,
      });
    }
    const recommendableModuleIds = recommendableModules.map((module) => module.moduleId);

    let recommendedModulesForUser = [];
    if (campaignParticipationIds.length > 0) {
      recommendedModulesForUser = await recommendedModulesRepository.findIdsByCampaignParticipationIds({
        campaignParticipationIds,
      });
    }

    const mandatoryModuleIds = combinedCourseDetails.moduleIds.filter(
      (moduleId) => !recommendableModuleIds.includes(moduleId),
    );

    const recommendedModuleIds = recommendedModulesForUser.map(({ moduleId }) => moduleId);
    const moduleToSynchronizeIds = [...recommendedModuleIds, ...mandatoryModuleIds];

    await organizationLearnerPassageParticipationRepository.synchronize({
      organizationLearnerId: combinedCourseParticipation.organizationLearnerId,
      moduleIds: moduleToSynchronizeIds,
    });

    const isCombinedCourseCompleted = combinedCourseDetails.isCompleted(
      dataForQuest,
      recommendableModules,
      recommendedModulesForUser,
    );

    if (isCombinedCourseCompleted) {
      combinedCourseParticipation.complete();
      return combinedCourseParticipationRepository.update({ combinedCourseParticipation });
    }

    return combinedCourseParticipation;
  },
);
