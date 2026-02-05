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
  combinedCourseToCreateService,
}) => {
  const combinedCourseBlueprint = await combinedCourseBlueprintRepository.findById({
    id: combinedCourseBlueprintId,
  });

  const { campaignsToCreate, modules } = await combinedCourseToCreateService.buildModulesAndCampaigns({
    organizationId,
    combinedCourseBlueprint,
    creatorId,
    moduleRepository,
    codeGenerator,
    accessCodeRepository,
    recommendedModuleRepository,
    targetProfileRepository,
  });

  const createdCampaigns = await campaignRepository.save({ campaigns: campaignsToCreate });
  const combinedCourseCode = await codeGenerator.generate(accessCodeRepository);

  const combinedCourse = combinedCourseBlueprint.toCombinedCourse({
    name,
    description: combinedCourseBlueprint.description,
    illustration: combinedCourseBlueprint.illustration,
    code: combinedCourseCode,
    organizationId,
    campaigns: createdCampaigns,
    modulesByShortId: Object.groupBy(modules, ({ shortId }) => shortId),
  });

  return combinedCourseRepository.save({ combinedCourse });
};
