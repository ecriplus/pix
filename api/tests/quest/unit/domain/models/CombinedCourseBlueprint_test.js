import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import {
  COMBINED_COURSE_BLUEPRINT_ITEMS,
  CombinedCourseBlueprint,
} from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import { Module } from '../../../../../src/quest/domain/models/Module.js';
import {
  CRITERION_COMPARISONS,
  Quest,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourseBlueprint ', function () {
  describe('#constructor', function () {
    it('should construct object', function () {
      // given
      const values = {
        id: 1,
        name: 'name',
        internalName: 'internaleName',
        description: 'description',
        illustration: 'illustration',
        content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: '123' }]),
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-26'),
        organizationIds: [],
        quest: null,
      };
      // when
      const blueprint = new CombinedCourseBlueprint(values);

      // then
      expect(blueprint).deep.equal(values);
    });
  });
  describe('#buildContentItems', function () {
    it('should build blueprint content items for targetProfileId and moduleId', function () {
      const requirements = CombinedCourseBlueprint.buildContentItems([
        { targetProfileId: 123 },
        { moduleShortId: 'az-123' },
      ]);

      expect(requirements).deep.equal([
        {
          type: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION,
          value: 123,
        },
        {
          type: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE,
          value: 'az-123',
        },
      ]);
    });
  });

  describe('#moduleIds', function () {
    it('should return module ids from passages success requirements', async function () {
      const firstTargetProfileId = 1;

      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              moduleId: {
                data: 'moduleId-555',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              moduleId: {
                data: 'moduleId-777',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              isTerminated: {
                data: true,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: firstTargetProfileId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
        ],
      });

      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'combinix',
        quest,
      });
      expect(combinedCourseBlueprint.moduleIds).to.deep.equal(['moduleId-555', 'moduleId-777']);
    });

    it('should return empty list of ids if template has no passages success requirements', async function () {
      const firstTargetProfileId = 1;

      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: firstTargetProfileId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
        ],
      });

      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'combinix',
        quest,
      });
      expect(combinedCourseBlueprint.moduleIds).to.deep.equal([]);
    });
  });

  describe('#getTargetProfileIds', function () {
    it('should return target profile ids from campaignParticipations success requirements', async function () {
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: 1,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: 8,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
        ],
      });

      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'combinix',
        quest,
      });
      expect(combinedCourseBlueprint.targetProfileIds).to.deep.equal([1, 8]);
    });
    it('should return empty list of ids if template has not any campaignParticipations success requirements', async function () {
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              moduleId: {
                data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
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

      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'combinix',
        quest,
      });
      expect(combinedCourseBlueprint.targetProfileIds).to.deep.equal([]);
    });
  });

  describe('#toCombinedCourse', function () {
    it('should create combined course from blueprint and given organization data ', async function () {
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
      const moduleId = 'eeeb4951-6f38-4467-a4ba-0c85ed71321a';

      const description = 'bla bla bla';
      const illustration = 'illu.svg';

      const combinedCourseBlueprintQuest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: firstTargetProfileId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: secondTargetProfileId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
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

      // when
      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name,
        description,
        illustration,
        quest: combinedCourseBlueprintQuest,
      });
      const combinedCourse = combinedCourseBlueprint.toCombinedCourse({
        code,
        organizationId,
        campaigns,
      });

      // then
      const expectedQuest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              campaignId: {
                data: firstCampaignId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              campaignId: {
                data: secondCampaignId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
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

      expect(combinedCourse).to.be.instanceOf(CombinedCourse);
      expect(combinedCourse.quest.toDTO().successRequirements).to.deep.equal(expectedQuest.toDTO().successRequirements);
      expect(combinedCourse.name).to.equal(name);
      expect(combinedCourse.description).to.equal(description);
      expect(combinedCourse.illustration).to.equal(illustration);
      expect(combinedCourse.code).to.equal(code);
      expect(combinedCourse.organizationId).to.equal(organizationId);
    });
  });

  describe('#buildWithQuest', function () {
    it('should return combined course blueprint with quest', async function () {
      // given
      const targetProfileId = 1;
      const moduleId = 'eeeb4951-6f38-4467-a4ba-0c85ed71321a';
      const modulesByShortId = {
        ecc13f55: [new Module({ id: moduleId })],
      };
      const combinedCourseContent = [
        {
          type: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION,
          value: targetProfileId,
        },
        {
          type: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE,
          value: 'ecc13f55',
        },
      ];
      const name = 'Combinix';
      const description = 'bla bla bla';
      const illustration = 'illu.svg';

      const blueprintQuest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              targetProfileId: {
                data: targetProfileId,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
              status: {
                data: 'SHARED',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
            comparison: REQUIREMENT_COMPARISONS.ALL,
            data: {
              moduleId: {
                data: 'eeeb4951-6f38-4467-a4ba-0c85ed71321a',
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

      // when
      const combinedCourseBlueprint = CombinedCourseBlueprint.buildWithQuest({
        combinedCourseBlueprint: new CombinedCourseBlueprint({
          name,
          content: combinedCourseContent,
          quest: blueprintQuest,
          description,
          illustration,
        }),
        modulesByShortId,
      });

      // then
      const questDTO = blueprintQuest.toDTO();
      const targetProfileRequirement = questDTO.successRequirements[0];
      const moduleRequirementWithId = {
        ...questDTO.successRequirements[1],
        data: {
          ...questDTO.successRequirements[1].data,
          moduleId: { data: moduleId, comparison: CRITERION_COMPARISONS.EQUAL },
        },
      };

      //todo: check content as well
      expect(combinedCourseBlueprint.quest).to.be.instanceOf(Quest);
      expect(combinedCourseBlueprint.quest.toDTO().successRequirements[0]).to.deep.equal(targetProfileRequirement);

      expect(combinedCourseBlueprint.quest.toDTO().successRequirements.length).to.equal(2);

      expect(combinedCourseBlueprint.quest.toDTO().successRequirements[1]).to.deep.equal(moduleRequirementWithId);
    });
  });

  describe('#detachOrganization', function () {
    it('should retrieve organization id from model instance', async function () {
      //given
      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'Blueprint1',
        content: [],
        description: '',
        illustration: '',
        organizationIds: [1],
      });

      //when
      combinedCourseBlueprint.detachOrganization({ organizationId: 1 });

      //then
      expect(combinedCourseBlueprint.organizationIds).empty;
    });
  });
  describe('#attachOrganizations', function () {
    it('should add organization ids to the model instance', async function () {
      //given
      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'Blueprint1',
        content: [],
        description: '',
        illustration: '',
        organizationIds: [1],
      });

      //when
      combinedCourseBlueprint.attachOrganizations({ organizationIds: [2, 3] });

      //then
      expect(combinedCourseBlueprint.organizationIds).to.deep.equal([1, 2, 3]);
    });

    it('should return attached organization ids and duplicated ids', async function () {
      //given
      const combinedCourseBlueprint = new CombinedCourseBlueprint({
        name: 'Blueprint1',
        content: [],
        description: '',
        illustration: '',
        organizationIds: [1],
      });

      //when
      const { attachedOrganizationIds, duplicatedOrganizationIds } = combinedCourseBlueprint.attachOrganizations({
        organizationIds: [1, 2, 3],
      });

      //then
      expect(attachedOrganizationIds).to.deep.equal([2, 3]);
      expect(duplicatedOrganizationIds).to.deep.equal([1]);
    });
  });
});
