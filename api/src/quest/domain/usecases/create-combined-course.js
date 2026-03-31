import { Campaign } from '../models/Campaign.js';

export const createCombinedCourse = async ({
  combinedCourseBlueprintId,
  name,
  creatorId,
  organizationId,
  campaignRepository,
  targetProfileRepository,
  codeGenerator,
  accessCodeRepository,
  combinedCourseRepository,
  combinedCourseBlueprintRepository,
  recommendedModuleRepository,
  moduleRepository,
  questRepository,
}) => {
  const combinedCourseBlueprint = await combinedCourseBlueprintRepository.findById({
    id: combinedCourseBlueprintId,
  });

  let modules = [];

  if (combinedCourseBlueprint.moduleIds) {
    modules = await moduleRepository.getByIds({
      moduleIds: combinedCourseBlueprint.moduleIds,
    });
  }

  const combinedCourseCode = await codeGenerator.generate(accessCodeRepository);

  const targetProfileIds = combinedCourseBlueprint.targetProfileIds ?? [];
  const targetProfiles = await targetProfileRepository.findByIds({ ids: targetProfileIds });
  const campaignsToCreate = [];
  const recommendableModules = await recommendedModuleRepository.findIdsByTargetProfileIds({
    targetProfileIds,
  });

  for (const targetProfile of targetProfiles) {
    const campaignForCombinedCourse = Campaign.buildCampaignForCombinedCourse({
      organizationId,
      targetProfile,
      creatorId,
      combinedCourseCode,
      recommendableModules: recommendableModules.filter((recommendableModule) =>
        recommendableModule.targetProfileIds.includes(targetProfile.id),
      ),
      modules,
    });
    campaignsToCreate.push(campaignForCombinedCourse);
  }

  const createdCampaigns = await campaignRepository.save({
    campaigns: campaignsToCreate,
  });

  const combinedCourse = combinedCourseBlueprint.toCombinedCourse({
    name,
    description: combinedCourseBlueprint.description,
    illustration: combinedCourseBlueprint.illustration,
    code: combinedCourseCode,
    organizationId,
    campaigns: createdCampaigns,
  });

  return combinedCourseRepository.save({ combinedCourse, questRepository });
};
