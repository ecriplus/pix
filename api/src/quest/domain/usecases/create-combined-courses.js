import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { CsvParser } from '../../../shared/infrastructure/serializers/csv/csv-parser.js';
import { COMBINED_COURSE_HEADER } from '../constants.js';
import { Campaign } from '../models/Campaign.js';

export const createCombinedCourses = withTransaction(
  async ({
    payload,
    campaignRepository,
    targetProfileRepository,
    codeGenerator,
    accessCodeRepository,
    combinedCourseRepository,
    combinedCourseBlueprintRepository,
    recommendedModuleRepository,
    moduleRepository,
  }) => {
    const csvParser = new CsvParser(payload, COMBINED_COURSE_HEADER, { delimiter: ';' });
    const csvData = csvParser.parse();

    const combinedCourses = [];
    const pendingCodes = [];
    for (const row of csvData) {
      const { organizationIds: organizationIdsSeparatedByComma, creatorId, content, combinedCourseBlueprintId } = row;
      const organizationIds = organizationIdsSeparatedByComma.split(',');
      const combinedCourseInformation = JSON.parse(content);
      const combinedCourseBlueprint = await combinedCourseBlueprintRepository.findById({
        id: combinedCourseBlueprintId,
      });

      const targetProfileIds = combinedCourseBlueprint.targetProfileIds;
      const targetProfiles = await targetProfileRepository.findByIds({ ids: targetProfileIds });

      for (const organizationId of organizationIds) {
        const campaigns = [];
        const combinedCourseCode = await codeGenerator.generate(accessCodeRepository, pendingCodes);
        pendingCodes.push(combinedCourseCode);

        const modules = await moduleRepository.getByShortIds({
          moduleShortIds: combinedCourseBlueprint.moduleShortIds,
        });

        for (const targetProfile of targetProfiles) {
          const recommendableModules = await recommendedModuleRepository.findIdsByTargetProfileIds({
            targetProfileIds: [targetProfile.id],
          });

          const hasRecommendableModulesInTargetProfile =
            recommendableModules.length > 0 &&
            Boolean(recommendableModules.filter(({ moduleId }) => modules.map(({ id }) => id).includes(moduleId)));

          let combinedCourseUrl = '/parcours/' + combinedCourseCode;

          if (hasRecommendableModulesInTargetProfile) combinedCourseUrl += '/chargement';

          campaigns.push(
            new Campaign({
              organizationId: parseInt(organizationId),
              targetProfileId: targetProfile.id,
              creatorId: parseInt(creatorId),
              ownerId: parseInt(creatorId),
              name: targetProfile.internalName,
              title: targetProfile.name,
              customResultPageButtonUrl: combinedCourseUrl,
              customResultPageButtonText: 'Continuer',
            }),
          );
        }

        const createdCampaigns = await campaignRepository.save({ campaigns });

        const combinedCourse = combinedCourseBlueprint.toCombinedCourse({
          name: combinedCourseInformation.name,
          description: combinedCourseInformation.description,
          illustration: combinedCourseInformation.illustration,
          code: combinedCourseCode,
          organizationId,
          campaigns: createdCampaigns,
          modulesByShortId: Object.groupBy(modules, ({ shortId }) => shortId),
        });
        combinedCourses.push(combinedCourse);
      }
    }

    await combinedCourseRepository.saveInBatch({ combinedCourses });
  },
  { isolationLevel: 'repeatable read' },
);
