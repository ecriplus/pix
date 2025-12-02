import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseDetails } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { COMPARISONS as COMPARISONS_CRITERION } from '../../../../../src/quest/domain/models/CriterionProperty.js';
import {
  CRITERION_COMPARISONS,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import * as combinedCourseDetailsRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-details-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Repository | combined-course-details', function () {
  describe('#findByOrganizationId', function () {
    it('should return all combined course details for a given organization', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      const moduleId = 'eeeb4951-6f38-4467-a4ba-0c85ed71321a';
      const combinedCourse1 = databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE1',
        name: 'Parcours 1',
        organizationId,
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              campaignId: {
                data: campaignId,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              status: {
                data: CampaignParticipationStatuses.SHARED,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
        ],
      });
      const combinedCourse2 = databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE2',
        name: 'Parcours 2',
        organizationId,
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              moduleId: {
                data: moduleId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
        ],
      });
      await databaseBuilder.commit();

      // when
      const combinedCourses = await combinedCourseDetailsRepository.findByOrganizationId({ organizationId });

      // then
      expect(combinedCourses).lengthOf(2);
      expect(combinedCourses[0]).instanceof(CombinedCourseDetails);
      expect(combinedCourses[1]).instanceof(CombinedCourseDetails);
      expect(combinedCourses[0]).deep.equal(new CombinedCourseDetails(combinedCourse1));
      expect(combinedCourses[1]).deep.equal(new CombinedCourseDetails(combinedCourse2));
      expect(combinedCourses[0].campaignIds).deep.equal([campaignId]);
      expect(combinedCourses[1].moduleIds).deep.equal([moduleId]);
    });

    it('should return an empty array when no combined courses exist for the organization', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const anotherOrganizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE1',
        name: 'Parcours 1',
        organizationId: anotherOrganizationId,
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              campaignId: {
                data: 123,
                comparison: COMPARISONS_CRITERION.ALL,
              },
              status: {
                data: CampaignParticipationStatuses.SHARED,
                comparison: COMPARISONS_CRITERION.ALL,
              },
            },
          },
        ],
      });
      await databaseBuilder.commit();

      // when
      const combinedCourses = await combinedCourseDetailsRepository.findByOrganizationId({ organizationId });

      // then
      expect(combinedCourses).lengthOf(0);
    });
  });
});
