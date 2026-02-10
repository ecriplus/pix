import { Campaign } from '../../../prescription/campaign/domain/models/Campaign.js';

const buildModulesAndCampaigns = async ({
  organizationId,
  combinedCourseBlueprint,
  creatorId,
  moduleRepository,
  recommendedModuleRepository,
  targetProfileRepository,
  combinedCourseCode,
}) => {
  const targetProfileIds = combinedCourseBlueprint.targetProfileIds ?? [];
  const targetProfiles = await targetProfileRepository.findByIds({ ids: targetProfileIds });
  const campaignsToCreate = [];
  let modules = [];

  if (combinedCourseBlueprint.moduleShortIds) {
    modules = await moduleRepository.getByShortIds({
      moduleShortIds: combinedCourseBlueprint.moduleShortIds,
    });
  }

  for (const targetProfile of targetProfiles) {
    const campaignToCreate = await buildCampaign({
      targetProfile,
      modules,
      organizationId,
      creatorId,
      recommendedModuleRepository,
      combinedCourseCode,
    });
    campaignsToCreate.push(campaignToCreate);
  }
  return { campaignsToCreate, modules };
};

const buildCampaign = async ({
  targetProfile,
  combinedCourseCode,
  modules,
  organizationId,
  creatorId,
  recommendedModuleRepository,
}) => {
  const recommendableModules = await recommendedModuleRepository.findIdsByTargetProfileIds({
    targetProfileIds: [targetProfile.id],
  });

  const hasRecommendableModulesInTargetProfile =
    recommendableModules.length > 0 &&
    Boolean(recommendableModules.filter(({ moduleId }) => modules.map(({ id }) => id).includes(moduleId)));

  let combinedCourseUrl = '/parcours/' + combinedCourseCode;

  if (hasRecommendableModulesInTargetProfile) combinedCourseUrl += '/chargement';

  return new Campaign({
    organizationId: parseInt(organizationId),
    targetProfileId: targetProfile.id,
    creatorId: parseInt(creatorId),
    ownerId: parseInt(creatorId),
    name: targetProfile.internalName,
    title: targetProfile.name,
    customResultPageButtonUrl: combinedCourseUrl,
    customResultPageButtonText: 'Continuer',
  });
};

export default { buildModulesAndCampaigns };
