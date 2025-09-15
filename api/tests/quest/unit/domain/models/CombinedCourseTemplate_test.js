import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseTemplate } from '../../../../../src/quest/domain/models/CombinedCourseTemplate.js';
import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourseTemplate', function () {
  describe('#getTargetProfileIds', function () {
    it('should return target profile ids from campaignParticipations success requirements', async function () {
      const successRequirements = [
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            targetProfileId: {
              data: 1,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            targetProfileId: {
              data: 8,
              comparison: 'equal',
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
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: 'equal',
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
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            targetProfileId: {
              data: firstTargetProfileId,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            targetProfileId: {
              data: secondTargetProfileId,
              comparison: 'equal',
            },
          },
        },
        {
          requirement_type: 'passages',
          comparison: 'all',
          data: {
            moduleId: {
              data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
              comparison: 'equal',
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
            requirement_type: 'campaignParticipations',
            comparison: 'all',
            data: {
              campaignId: {
                data: firstCampaignId,
                comparison: 'equal',
              },
              status: {
                data: 'SHARED',
                comparison: 'equal',
              },
            },
          },
          {
            requirement_type: 'campaignParticipations',
            comparison: 'all',
            data: {
              campaignId: {
                data: secondCampaignId,
                comparison: 'equal',
              },
              status: {
                data: 'SHARED',
                comparison: 'equal',
              },
            },
          },
          {
            requirement_type: 'passages',
            comparison: 'all',
            data: {
              moduleId: {
                data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
                comparison: 'equal',
              },
              isTerminated: {
                data: true,
                comparison: 'equal',
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
