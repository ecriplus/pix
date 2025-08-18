import { withTransaction } from '../../../shared/domain/DomainTransaction.js';
import { CsvParser } from '../../../shared/infrastructure/serializers/csv/csv-parser.js';
import { COMBINED_COURSE_HEADER } from '../constants.js';
import { Campaign } from '../models/Campaign.js';
import { CombinedCourseTemplate } from '../models/CombinedCourseTemplate.js';

export const createCombinedCourses = withTransaction(
  async ({
    payload,
    campaignRepository,
    targetProfileRepository,
    codeGenerator,
    accessCodeRepository,
    combinedCourseRepository,
  }) => {
    const csvParser = new CsvParser(payload, COMBINED_COURSE_HEADER);
    const csvData = csvParser.parse();

    const combinedCourses = [];
    const pendingCodes = [];
    for (const row of csvData) {
      const { organizationIds: organizationIdsSeparatedByComma, creatorId, content } = row;
      const organizationIds = organizationIdsSeparatedByComma.split(',');
      const combinedCourseInformation = JSON.parse(content);
      const combinedCourseTemplate = new CombinedCourseTemplate(combinedCourseInformation);
      const targetProfileIds = combinedCourseTemplate.targetProfileIds;
      const targetProfiles = await targetProfileRepository.findByIds({ ids: targetProfileIds });

      for (const organizationId of organizationIds) {
        const code = await codeGenerator.generate(accessCodeRepository, pendingCodes);
        pendingCodes.push(code);
        // TODO: Plus tard avoir une url relative -> Futur ticket PIX-19131
        const combinedCourseUrl = 'http://localhost:4200' + '/parcours/' + code;
        const campaigns = targetProfiles.map((targetProfile) => {
          return new Campaign({
            organizationId: parseInt(organizationId),
            targetProfileId: targetProfile.id,
            creatorId: parseInt(creatorId),
            ownerId: parseInt(creatorId),
            type: 'ASSESSMENT',
            multipleSendings: false,
            name: targetProfile.internalName,
            title: targetProfile.name,
            customResultPageButtonUrl: combinedCourseUrl,
            customResultPageButtonText: 'Continuer',
          });
        });

        const createdCampaigns = await campaignRepository.save({ campaigns });

        const combinedCourse = combinedCourseTemplate.toCombinedCourse(code, organizationId, createdCampaigns);
        combinedCourses.push(combinedCourse);
      }
    }

    await combinedCourseRepository.saveInBatch({ combinedCourses });
  },
);
