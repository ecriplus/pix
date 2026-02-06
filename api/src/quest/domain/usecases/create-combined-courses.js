import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { CsvParser } from '../../../shared/infrastructure/serializers/csv/csv-parser.js';
import { COMBINED_COURSE_HEADER } from '../constants.js';

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
    combinedCourseToCreateService,
    questRepository,
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

      for (const organizationId of organizationIds) {
        const combinedCourseCode = await codeGenerator.generate(accessCodeRepository, pendingCodes);
        pendingCodes.push(combinedCourseCode);

        const { campaignsToCreate, modules } = await combinedCourseToCreateService.buildModulesAndCampaigns({
          organizationId,
          combinedCourseBlueprint,
          creatorId,
          moduleRepository,
          combinedCourseCode,
          recommendedModuleRepository,
          targetProfileRepository,
        });

        const createdCampaigns = await campaignRepository.save({ campaigns: campaignsToCreate });

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

    await combinedCourseRepository.saveInBatch({ combinedCourses, questRepository });
  },
);
