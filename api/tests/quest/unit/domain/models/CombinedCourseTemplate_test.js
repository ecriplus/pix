import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseTemplate } from '../../../../../src/quest/domain/models/CombinedCourseTemplate.js';
import { COMPARISONS as COMPARISONS_CRITERION } from '../../../../../src/quest/domain/models/CriterionProperty.js';
import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import { COMPARISONS as COMPARISONS_REQUIREMENT, TYPES } from '../../../../../src/quest/domain/models/Requirement.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourseTemplate', function () {
  describe('#getTargetProfileIds', function () {
    it('should return target profile ids from campaignParticipations success requirements', async function () {
      const successRequirements = [
        {
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            targetProfileId: {
              data: 1,
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
        {
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            targetProfileId: {
              data: 8,
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
      ];
      const combinedCourseTemplate = new CombinedCourseTemplate({
        successRequirements,
      });
      expect(combinedCourseTemplate.targetProfileIds).to.deep.equal([1, 8]);
    });
    it('should return empty list of ids if template has not any campaignParticipations success requirements', async function () {
      const successRequirements = [
        {
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
      ];
      const combinedCourseTemplate = new CombinedCourseTemplate({
        successRequirements,
      });
      expect(combinedCourseTemplate.targetProfileIds).to.deep.equal([]);
    });
  });

  describe('#moduleIds', function () {
    it('should return module ids from passages success requirements', async function () {
      const successRequirements = [
        {
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            moduleId: {
              data: 'abcdef-555',
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
        {
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            moduleId: {
              data: 'abcdef-777',
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
        {
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            targetProfileId: {
              data: 8,
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
      ];
      const combinedCourseTemplate = new CombinedCourseTemplate({
        successRequirements,
      });
      expect(combinedCourseTemplate.moduleIds).to.deep.equal(['abcdef-555', 'abcdef-777']);
    });

    it('should return empty list of ids if template has not any campaignParticipations success requirements', async function () {
      const successRequirements = [
        {
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            targetProfileId: {
              data: 12,
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
      ];
      const combinedCourseTemplate = new CombinedCourseTemplate({
        successRequirements,
      });
      expect(combinedCourseTemplate.moduleIds).to.deep.equal([]);
    });
  });
  describe('#toCombinedCourse', function () {
    it('should create combined course from template and given organization data ', async function () {
      // given
      const organizationId = 1;
      const firstCampaignId = 1001;
      const secondCampaignId = 1002;
      const firstTargetProfileId = 1;
      const secondTargetProfileId = 2;
      const name = 'Combinix';
      const code = 'COMBINIX1';
      const campaigns = [
        {
          id: firstCampaignId,
          targetProfileId: firstTargetProfileId,
        },
        {
          id: secondCampaignId,
          targetProfileId: secondTargetProfileId,
        },
      ];
      const successRequirements = [
        {
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            targetProfileId: {
              data: firstTargetProfileId,
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
        {
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            targetProfileId: {
              data: secondTargetProfileId,
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
        {
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS_REQUIREMENT.ALL,
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: COMPARISONS_CRITERION.EQUAL,
            },
          },
        },
      ];
      const description = 'bla bla bla';
      const illustration = 'illu.svg';

      // when
      const combinedCourseTemplate = new CombinedCourseTemplate({
        name,
        successRequirements,
        description,
        illustration,
      });
      const combinedCourse = combinedCourseTemplate.toCombinedCourse(code, organizationId, campaigns);

      // then
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              campaignId: {
                data: firstCampaignId,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              campaignId: {
                data: secondCampaignId,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
          {
            requirement_type: TYPES.OBJECT.PASSAGES,
            comparison: COMPARISONS_REQUIREMENT.ALL,
            data: {
              moduleId: {
                data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: COMPARISONS_CRITERION.EQUAL,
              },
            },
          },
        ],
      });
      const questDTO = quest.toDTO();

      expect(combinedCourse).to.be.instanceOf(CombinedCourse);

      expect(combinedCourse.quest.toDTO().successRequirements).to.deep.equal(questDTO.successRequirements);
      expect(combinedCourse.name).to.equal(name);
      expect(combinedCourse.description).to.equal(description);
      expect(combinedCourse.illustration).to.equal(illustration);
      expect(combinedCourse.code).to.equal(code);
      expect(combinedCourse.organizationId).to.equal(organizationId);
    });
  });
});
