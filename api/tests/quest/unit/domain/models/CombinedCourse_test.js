import {
  CampaignParticipationStatuses,
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../../../src/prescription/shared/domain/constants.js';
import { Campaign } from '../../../../../src/quest/domain/models/Campaign.js';
import { CombinedCourse, CombinedCourseDetails } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import {
  COMBINED_COURSE_ITEM_TYPES,
  CombinedCourseItem,
} from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import { CombinedCourseTemplate } from '../../../../../src/quest/domain/models/CombinedCourseTemplate.js';
import { COMPARISONS as CRITERION_COMPARISONS } from '../../../../../src/quest/domain/models/CriterionProperty.js';
import { DataForQuest } from '../../../../../src/quest/domain/models/DataForQuest.js';
import { Eligibility } from '../../../../../src/quest/domain/models/Eligibility.js';
import { Module } from '../../../../../src/quest/domain/models/Module.js';
import { Quest, REQUIREMENT_TYPES } from '../../../../../src/quest/domain/models/Quest.js';
import { COMPARISONS as REQUIREMENT_COMPARISONS } from '../../../../../src/quest/domain/models/Requirement.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourse', function () {
  describe('CombinedCourseDetails', function () {
    let id, organizationId, name, code, questId;

    beforeEach(function () {
      id = 1;
      questId = 2;
      organizationId = 1;
      name = 'name';
      code = 'code';
    });

    describe('#campaignIds', function () {
      it('should only return ids of all campaigns included in the given combined course', function () {
        // given
        const campaignId = 2;
        const quest = new Quest({
          id: questId,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              comparison: REQUIREMENT_COMPARISONS.ALL,
              data: {
                campaignId: {
                  data: campaignId,
                  comparison: CRITERION_COMPARISONS.EQUAL,
                },
                status: {
                  data: CampaignParticipationStatuses.SHARED,
                  comparison: CRITERION_COMPARISONS.EQUAL,
                },
              },
            },
            {
              requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              comparison: REQUIREMENT_COMPARISONS.ALL,
              data: {
                moduleId: {
                  data: 7,
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
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          quest,
        );

        // when
        const hasCampaigns = combinedCourse.hasCampaigns;
        const campaignIds = combinedCourse.campaignIds;

        // then
        expect(hasCampaigns).equal(true);
        expect(campaignIds).to.deep.equal([campaignId]);
      });

      it('should return false to hasCampaign if no campaign on combined course', function () {
        // given
        const questWithoutCampaign = new Quest({
          id: questId,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              comparison: REQUIREMENT_COMPARISONS.ALL,
              data: {
                moduleId: {
                  data: 7,
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
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          questWithoutCampaign,
        );

        // when
        const hasCampaigns = combinedCourse.hasCampaigns;
        const campaignIds = combinedCourse.campaignIds;

        // then
        expect(hasCampaigns).equal(false);
        expect(campaignIds).deep.equal([]);
      });
    });

    describe('#moduleIds', function () {
      it('should only return ids of all modules included in the given combined course', function () {
        // given
        const moduleId = 7;
        const quest = new Quest({
          id: 1,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              comparison: REQUIREMENT_COMPARISONS.ALL,
              data: {
                campaignId: {
                  data: 2,
                  comparison: CRITERION_COMPARISONS.EQUAL,
                },
                status: {
                  data: CampaignParticipationStatuses.SHARED,
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
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          quest,
        );

        // when
        const hasModules = combinedCourse.hasModules;
        const moduleIds = combinedCourse.moduleIds;

        // then
        expect(hasModules).equal(true);
        expect(moduleIds).to.deep.equal([moduleId]);
      });

      it('should return false to hasModules if no module on combined course', function () {
        // given
        const questWithoutModules = new Quest({
          id: questId,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              comparison: REQUIREMENT_COMPARISONS.ALL,
              data: {
                campaignId: {
                  data: 2,
                  comparison: CRITERION_COMPARISONS.EQUAL,
                },
                status: {
                  data: CampaignParticipationStatuses.SHARED,
                  comparison: CRITERION_COMPARISONS.EQUAL,
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          questWithoutModules,
        );

        // when
        const hasModules = combinedCourse.hasModules;
        const moduleIds = combinedCourse.moduleIds;

        // then
        expect(hasModules).equal(false);
        expect(moduleIds).deep.equal([]);
      });
    });

    describe('#participationDetails', function () {
      it('should return a participation details with correct items count', function () {
        // given
        const participation = new CombinedCourseParticipation({
          id: 123,
          firstName: 'Bob',
          lastName: 'Lapointe',
          group: 'Groupe A',
          division: '4eme B',
          status: CombinedCourseParticipationStatuses.STARTED,
          updatedAt: new Date('2024-12-10'),
          createdAt: new Date('2024-12-09'),
        });

        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          {},
          participation,
        );
        const inProgressCampaignItem = new CombinedCourseItem({
          id: 1,
          type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
          isCompleted: false,
        });
        const doneCampaignItem = new CombinedCourseItem({
          id: 2,
          type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
          isCompleted: true,
        });
        const inProgressModuleItem = new CombinedCourseItem({
          id: 3,
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          isCompleted: false,
        });
        const doneModuleItem = new CombinedCourseItem({
          id: 4,
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          isCompleted: true,
        });

        combinedCourse.items = [doneCampaignItem, doneModuleItem, inProgressCampaignItem, inProgressModuleItem];

        // then
        expect(combinedCourse.participationDetails).deep.equal({
          id: participation.id,
          division: participation.division,
          group: participation.group,
          firstName: participation.firstName,
          lastName: participation.lastName,
          status: participation.status,
          createdAt: participation.createdAt,
          updatedAt: participation.updatedAt,
          hasFormationItem: false,
          nbCampaigns: 2,
          nbModules: 2,
          nbModulesCompleted: 1,
          nbCampaignsCompleted: 1,
        });
      });

      it('should return hasFormationItems if a formation item is present', function () {
        // given
        const participation = new CombinedCourseParticipation({
          id: 123,
          firstName: 'Bob',
          lastName: 'Lapointe',
          group: 'Groupe A',
          division: '6eme B',
          status: CombinedCourseParticipationStatuses.STARTED,
          updatedAt: new Date('2024-12-10'),
          createdAt: new Date('2024-12-09'),
        });

        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          {},
          participation,
        );
        const inProgressCampaignItem = new CombinedCourseItem({
          id: 1,
          type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
          isCompleted: false,
        });
        const inProgressModuleItem = new CombinedCourseItem({
          id: 2,
          type: COMBINED_COURSE_ITEM_TYPES.MODULE,
          isCompleted: false,
        });
        const formationItem = new CombinedCourseItem({
          id: 3,
          type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
          isCompleted: false,
        });

        combinedCourse.items = [inProgressCampaignItem, formationItem, inProgressModuleItem];

        // then
        expect(combinedCourse.participationDetails).deep.equal({
          id: participation.id,
          firstName: participation.firstName,
          lastName: participation.lastName,
          status: participation.status,
          group: 'Groupe A',
          division: '6eme B',
          createdAt: participation.createdAt,
          updatedAt: participation.updatedAt,
          hasFormationItem: true,
          nbCampaigns: 1,
          nbModules: 2,
          nbModulesCompleted: 0,
          nbCampaignsCompleted: 0,
        });
      });
    });

    describe('#isCompleted', function () {
      describe('when items are type campaignParticipations', function () {
        it('returns true when every participations are shared', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique' });
          const secondCampaign = new Campaign({ id: 3, code: 'ABCDIAG2', title: 'diagnostique2' });

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  campaignId: {
                    data: campaign.id,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                  status: {
                    data: CampaignParticipationStatuses.SHARED,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                },
              },
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  campaignId: {
                    data: secondCampaign.id,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                  status: {
                    data: CampaignParticipationStatuses.SHARED,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                },
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: CampaignParticipationStatuses.SHARED,
              },
              {
                campaignId: secondCampaign.id,

                status: CampaignParticipationStatuses.SHARED,
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.true;
        });
        it('returns false when some participations are not shared', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique' });
          const secondCampaign = new Campaign({ id: 3, code: 'ABCDIAG2', title: 'diagnostique2' });

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  campaignId: {
                    data: campaign.id,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                  status: {
                    data: CampaignParticipationStatuses.SHARED,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                },
              },
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  campaignId: {
                    data: secondCampaign.id,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                  status: {
                    data: CampaignParticipationStatuses.SHARED,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                },
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: CampaignParticipationStatuses.STARTED,
              },
              {
                campaignId: secondCampaign.id,

                status: CampaignParticipationStatuses.SHARED,
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.false;
        });
      });
      describe('when items are type module', function () {
        it('returns true when every passages are terminated', function () {
          // given
          const firstModuleId = 1;
          const secondModuleId = 2;

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  moduleId: {
                    data: firstModuleId,
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
                    data: secondModuleId,
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
          const eligibility = new Eligibility({
            passages: [
              {
                referenceId: firstModuleId,
                isTerminated: true,
              },
              {
                referenceId: secondModuleId,
                isTerminated: true,
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.true;
        });
        it('returns false when some passages are not terminated', function () {
          // given
          const firstModuleId = 1;
          const secondModuleId = 2;

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  moduleId: {
                    data: firstModuleId,
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
                    data: secondModuleId,
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
          const eligibility = new Eligibility({
            passages: [
              {
                referenceId: firstModuleId,
                isTerminated: true,
              },
              {
                referenceId: secondModuleId,
                isTerminated: false,
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.false;
        });
      });

      describe('when items are mixed', function () {
        it('returns true when all modules and campaignParticipations are done', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique' });
          const moduleId = 1;

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  campaignId: {
                    data: campaign.id,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                  status: {
                    data: CampaignParticipationStatuses.SHARED,
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
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: CampaignParticipationStatuses.SHARED,
              },
            ],
            passages: [
              {
                referenceId: moduleId,
                isTerminated: true,
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.true;
        });
        it('returns false when some modules and campaignParticipations are not done', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique' });
          const moduleId = 1;

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: {
                  campaignId: {
                    data: campaign.id,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                  status: {
                    data: CampaignParticipationStatuses.SHARED,
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
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: CampaignParticipationStatuses.STARTED,
              },
            ],
            passages: [
              {
                referenceId: moduleId,
                isTerminated: false,
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.false;
        });

        describe('when there are recommandable modules', function () {
          it('returns true when recommended modules are done', function () {
            // given
            const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique' });
            const moduleId = 1;
            const notRecommendedModuleId = 2;

            const quest = new Quest({
              id: 1,
              rewardId: null,
              rewardType: null,
              eligibilityRequirements: [],
              successRequirements: [
                {
                  requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  comparison: REQUIREMENT_COMPARISONS.ALL,
                  data: {
                    campaignId: {
                      data: campaign.id,
                      comparison: CRITERION_COMPARISONS.EQUAL,
                    },
                    status: {
                      data: CampaignParticipationStatuses.SHARED,
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
                {
                  requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  comparison: REQUIREMENT_COMPARISONS.ALL,
                  data: {
                    moduleId: {
                      data: notRecommendedModuleId,
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
            const eligibility = new Eligibility({
              campaignParticipations: [
                {
                  campaignId: campaign.id,
                  status: CampaignParticipationStatuses.SHARED,
                },
              ],
              passages: [
                {
                  referenceId: moduleId,
                  isTerminated: true,
                },
                {
                  referenceId: notRecommendedModuleId,
                  isTerminated: false,
                },
              ],
            });
            const dataForQuest = new DataForQuest({ eligibility });
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id, organizationId, name, code, questId }),
              quest,
            );

            // when
            const result = combinedCourse.isCompleted(
              dataForQuest,
              [{ moduleId }, { moduleId: notRecommendedModuleId }],
              [{ moduleId }],
            );

            // then
            expect(result).to.be.true;
          });
          it('returns false when recommended modules are not done', function () {
            // given
            const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique' });
            const moduleId = 1;
            const notRecommendedModuleId = 2;

            const quest = new Quest({
              id: 1,
              rewardId: null,
              rewardType: null,
              eligibilityRequirements: [],
              successRequirements: [
                {
                  requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  comparison: REQUIREMENT_COMPARISONS.ALL,
                  data: {
                    campaignId: {
                      data: campaign.id,
                      comparison: CRITERION_COMPARISONS.EQUAL,
                    },
                    status: {
                      data: CampaignParticipationStatuses.SHARED,
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
                {
                  requirement_type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  comparison: REQUIREMENT_COMPARISONS.ALL,
                  data: {
                    moduleId: {
                      data: notRecommendedModuleId,
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
            const eligibility = new Eligibility({
              campaignParticipations: [
                {
                  campaignId: campaign.id,
                  status: CampaignParticipationStatuses.SHARED,
                },
              ],
              passages: [
                {
                  referenceId: moduleId,
                  isTerminated: false,
                },
                {
                  referenceId: notRecommendedModuleId,
                  isTerminated: false,
                },
              ],
            });
            const dataForQuest = new DataForQuest({ eligibility });
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id, organizationId, name, code, questId }),
              quest,
            );

            // when
            const result = combinedCourse.isCompleted(
              dataForQuest,
              [{ moduleId }, { moduleId: notRecommendedModuleId }],
              [{ moduleId }],
            );

            // then
            expect(result).to.be.false;
          });
        });
      });
    });

    describe('#generateItems', function () {
      describe('when item is type campaign', function () {
        it('returns a combined course item for provided campaign', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 7 });

          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'Combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                value: campaign.targetProfileId,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );

          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.SHARED }],
            }),
          });
          // when
          combinedCourse.generateItems({ itemDetails: [campaign], dataForQuest });

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.title,
              type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
              masteryRate: null,
              validatedStagesCount: null,
              totalStagesCount: null,
              isCompleted: true,
              isLocked: false,
            }),
          ]);
        });
        it('should not take encryptedCombinedCourseUrl if item type is campaign', function () {
          // given
          const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 7 });
          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,

                value: campaign.targetProfileId,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );
          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.SHARED }],
            }),
          });
          // when
          combinedCourse.generateItems({ itemDetails: [campaign], encryptedCombinedCourseUrl, dataForQuest });

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.title,
              type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
              masteryRate: null,
              totalStagesCount: null,
              validatedStagesCount: null,
              redirection: undefined,
              isCompleted: true,
              isLocked: false,
            }),
          ]);
        });
        it('should return a combined course item even if data for quest is empty', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 7 });

          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,

                value: campaign.targetProfileId,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );

          // when
          combinedCourse.generateItems({ itemDetails: [campaign] });

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.title,
              type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
              isCompleted: false,
              isLocked: false,
              masteryRate: null,
              totalStagesCount: null,
              validatedStagesCount: null,
            }),
          ]);
        });
      });

      describe('when items are type module', function () {
        it('should return module if it is in quest but not is not in target profile', function () {
          // given
          const recommendableModuleIds = [];
          const recommendedModuleIdsForUser = [];
          const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                value: 'abcdefgh1',
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );
          const module = new Module({ id: 'abcdefgh1', title: 'module', duration: 10 });
          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              passages: [
                {
                  referenceId: 7,
                  isTerminated: false,
                },
              ],
            }),
          });
          // when
          combinedCourse.generateItems({
            itemDetails: [module],
            recommendableModuleIds,
            recommendedModuleIdsForUser,
            encryptedCombinedCourseUrl,
            dataForQuest,
          });

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: module.id,
              reference: module.slug,
              title: module.title,
              type: COMBINED_COURSE_ITEM_TYPES.MODULE,
              redirection: encryptedCombinedCourseUrl,
              isCompleted: false,
              isLocked: false,
              duration: 10,
            }),
          ]);
        });
        it('should not return module if it is recommandable, but not recommended for user', function () {
          // given
          const module = new Module({ id: 'module-id', title: 'module' });
          const campaign = new Campaign({ id: 777, targetProfileId: 888 });
          const recommendableModuleIds = [{ moduleId: module.id, targetProfileIds: [campaign.targetProfileId] }];
          const recommendedModuleIdsForUser = [];
          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                value: campaign.targetProfileId,
              },
              {
                type: REQUIREMENT_TYPES.OBJECT.PASSAGES,

                value: module.id,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );

          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.SHARED }],
              passages: [
                {
                  referenceId: module.id,
                  isTerminated: false,
                },
              ],
            }),
          });

          // when
          combinedCourse.generateItems({
            itemDetails: [campaign, module],
            recommendableModuleIds,
            recommendedModuleIdsForUser,
            dataForQuest,
          });

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.title,
              type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
              isCompleted: true,
              isLocked: false,
              masteryRate: null,
              totalStagesCount: null,
              validatedStagesCount: null,
            }),
          ]);
        });
        it('should return module if it in quest, recommandable and recommended for user', function () {
          // given
          const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
          const module = new Module({ id: 'ebcde1', title: 'module' });
          const campaign = new Campaign({ id: 777, targetProfileId: 888 });

          const recommendableModuleIds = [{ moduleId: module.id, targetProfileIds: [campaign.targetProfileId] }];
          const recommendedModuleIdsForUser = [{ moduleId: module.id }];
          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,

                value: campaign.targetProfileId,
              },
              {
                type: REQUIREMENT_TYPES.OBJECT.PASSAGES,

                value: module.id,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );
          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.SHARED }],
              passages: [
                {
                  referenceId: module.id,
                  isTerminated: false,
                },
              ],
            }),
          });

          // when
          combinedCourse.generateItems({
            itemDetails: [campaign, module],
            recommendableModuleIds,
            recommendedModuleIdsForUser,
            encryptedCombinedCourseUrl,
            dataForQuest,
          });

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.title,
              type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
              isCompleted: true,
              masteryRate: null,
              totalStagesCount: null,
              validatedStagesCount: null,
              isLocked: false,
            }),
            new CombinedCourseItem({
              id: module.id,
              reference: module.slug,
              title: module.title,
              type: COMBINED_COURSE_ITEM_TYPES.MODULE,
              redirection: encryptedCombinedCourseUrl,
              isCompleted: false,
              isLocked: false,
            }),
          ]);
        });
      });

      describe('when there needs to be a formation item', function () {
        describe('when there is only recommandable modules', function () {
          it('should return a campaign participation item and a formation item', function () {
            // given
            const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
            const firstModule = new Module({ id: 'abcdef1', title: 'module' });
            const secondModule = new Module({ id: 'abcdef2', title: 'module' });
            const campaign = new Campaign({ id: 777, targetProfileId: 888 });

            const recommendableModuleIds = [
              { moduleId: firstModule.id, targetProfileIds: [campaign.targetProfileId] },
              { moduleId: secondModule.id, targetProfileIds: [campaign.targetProfileId] },
            ];
            const recommendedModuleIdsForUser = [];
            const combinedCourseTemplate = new CombinedCourseTemplate({
              name: 'combinix',
              combinedCourseContent: [
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: campaign.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: firstModule.id,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: secondModule.id,
                },
              ],
            });
            const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id: 1, organizationId: 1, name: 'COMBINIX', code: 'COMBINIX1', questId: 2 }),
              combinedCourseQuestFormat,
            );
            const dataForQuest = new DataForQuest({
              eligibility: new Eligibility({
                campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.STARTED }],
                passages: [
                  {
                    referenceId: firstModule.id,
                    isTerminated: false,
                  },
                  {
                    referenceId: secondModule.id,
                    isTerminated: false,
                  },
                ],
              }),
            });

            // when
            combinedCourse.generateItems({
              itemDetails: [campaign, firstModule, secondModule],
              recommendableModuleIds,
              recommendedModuleIdsForUser,
              encryptedCombinedCourseUrl,
              dataForQuest,
            });

            // then
            expect(combinedCourse.items).to.deep.equal([
              new CombinedCourseItem({
                id: campaign.id,
                reference: campaign.code,
                title: campaign.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isCompleted: false,
                isLocked: false,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + campaign.targetProfileId,
                reference: campaign.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
            ]);
          });
          it('should return two campaign participation items and two formation items', function () {
            // given
            const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
            const firstModule = new Module({ id: 'abcdef1', title: 'module' });
            const secondModule = new Module({ id: 'abcdef2', title: 'module' });
            const campaign = new Campaign({ id: 777, targetProfileId: 888 });
            const secondCampaign = new Campaign({ id: 999, targetProfileId: 101 });

            const recommendableModuleIds = [
              { moduleId: firstModule.id, targetProfileIds: [campaign.targetProfileId] },
              { moduleId: secondModule.id, targetProfileIds: [secondCampaign.targetProfileId] },
            ];
            const recommendedModuleIdsForUser = [];
            const combinedCourseTemplate = new CombinedCourseTemplate({
              name: 'combinix',
              combinedCourseContent: [
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: campaign.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: firstModule.id,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: secondCampaign.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: secondModule.id,
                },
              ],
            });
            const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([
              campaign,
              secondCampaign,
            ]);
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id: 1, organizationId: 1, name: 'COMBINIX', code: 'COMBINIX1', questId: 2 }),
              combinedCourseQuestFormat,
            );
            const dataForQuest = new DataForQuest({
              eligibility: new Eligibility({
                campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.STARTED }],
                passages: [
                  {
                    referenceId: firstModule.id,
                    isTerminated: false,
                  },
                  {
                    referenceId: secondModule.id,
                    isTerminated: false,
                  },
                ],
              }),
            });

            // when
            combinedCourse.generateItems({
              itemDetails: [campaign, secondCampaign, firstModule, secondModule],
              recommendableModuleIds,
              recommendedModuleIdsForUser,
              encryptedCombinedCourseUrl,
              dataForQuest,
            });

            // then
            expect(combinedCourse.items).to.deep.equal([
              new CombinedCourseItem({
                id: campaign.id,
                reference: campaign.code,
                title: campaign.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isCompleted: false,
                isLocked: false,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + campaign.targetProfileId,
                reference: campaign.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
              new CombinedCourseItem({
                id: secondCampaign.id,
                reference: secondCampaign.code,
                title: secondCampaign.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                isCompleted: false,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isLocked: true,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + secondCampaign.targetProfileId,
                reference: secondCampaign.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
            ]);
          });
          it('should return a combined course item even if data for quest is empty', function () {
            // given
            const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
            const firstModule = new Module({ id: 'abcdef1', title: 'module' });
            const secondModule = new Module({ id: 'abcdef2', title: 'module' });
            const campaign = new Campaign({ id: 777, targetProfileId: 888 });

            const recommendableModuleIds = [
              { moduleId: firstModule.id, targetProfileIds: [campaign.targetProfileId] },
              { moduleId: secondModule.id, targetProfileIds: [campaign.targetProfileId] },
            ];
            const recommendedModuleIdsForUser = [];
            const combinedCourseTemplate = new CombinedCourseTemplate({
              name: 'combinix',
              combinedCourseContent: [
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: campaign.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: firstModule.id,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: secondModule.id,
                },
              ],
            });
            const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id: 1, organizationId: 1, name: 'COMBINIX', code: 'COMBINIX1', questId: 2 }),
              combinedCourseQuestFormat,
            );

            // when
            combinedCourse.generateItems({
              itemDetails: [campaign, firstModule, secondModule],
              recommendableModuleIds,
              recommendedModuleIdsForUser,
              encryptedCombinedCourseUrl,
            });

            // then
            expect(combinedCourse.items).to.deep.equal([
              new CombinedCourseItem({
                id: campaign.id,
                reference: campaign.code,
                title: campaign.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isCompleted: false,
                isLocked: false,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + campaign.targetProfileId,
                reference: campaign.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
            ]);
          });

          it('should return formation block for each target profile in the right order', function () {
            // given
            const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
            const module = new Module({ id: 'abcdef1', title: 'module' });
            const module2 = new Module({ id: 'abcdef3', title: 'module2' });
            const campaign = new Campaign({ id: 777, targetProfileId: 888, code: 'campaign123' });
            const campaign2 = new Campaign({ id: 333, targetProfileId: 666, code: 'campaign456' });

            const recommendableModuleIds = [
              { moduleId: module.id, targetProfileIds: [campaign2.targetProfileId, campaign.targetProfileId] },
              { moduleId: module2.id, targetProfileIds: [campaign2.targetProfileId] },
            ];
            const recommendedModuleIdsForUser = [];
            const combinedCourseTemplate = new CombinedCourseTemplate({
              name: 'combinix',
              combinedCourseContent: [
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: campaign.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: module.id,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: campaign2.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: module2.id,
                },
              ],
            });
            const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign, campaign2]);
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id, organizationId, name, code, questId: 2 }),
              combinedCourseQuestFormat,
            );
            const dataForQuest = new DataForQuest({
              eligibility: new Eligibility({
                campaignParticipations: [],
                passages: [
                  {
                    referenceId: module.id,
                    isTerminated: false,
                  },
                  {
                    referenceId: module2.id,
                    isTerminated: false,
                  },
                ],
              }),
            });

            // when
            combinedCourse.generateItems({
              itemDetails: [module2, campaign2, campaign, module],
              recommendableModuleIds,
              recommendedModuleIdsForUser,
              encryptedCombinedCourseUrl,
              dataForQuest,
            });

            // then
            expect(combinedCourse.items).to.deep.equal([
              new CombinedCourseItem({
                id: campaign.id,
                reference: campaign.code,
                title: campaign.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isCompleted: false,
                isLocked: false,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + campaign.targetProfileId,
                reference: campaign.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
              new CombinedCourseItem({
                id: campaign2.id,
                reference: campaign2.code,
                title: campaign2.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isCompleted: false,
                isLocked: true,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + campaign2.targetProfileId,
                reference: campaign2.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
            ]);
          });
        });

        describe('when there is a recommandable module and a quest item', function () {
          it('should return a formation item and a quest item', function () {
            // given
            const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
            const moduleFromTargetProfile = new Module({ id: 'abcdefgh1', title: 'module' });
            const moduleFromQuest = new Module({ id: 'abcdefgh3', title: 'module from quest' });
            const campaign = new Campaign({ id: 777, targetProfileId: 888 });

            const recommendableModuleIds = [
              { moduleId: moduleFromTargetProfile.id, targetProfileIds: [campaign.targetProfileId] },
            ];
            const recommendedModuleIdsForUser = [];
            const combinedCourseTemplate = new CombinedCourseTemplate({
              name: 'combinix',
              combinedCourseContent: [
                {
                  type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                  value: campaign.targetProfileId,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: moduleFromTargetProfile.id,
                },
                {
                  type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
                  value: moduleFromQuest.id,
                },
              ],
            });
            const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
            const combinedCourse = new CombinedCourseDetails(
              new CombinedCourse({ id: 1, organizationId: 1, name: 'COMBINIX', code: 'COMBINIX1', questId: 2 }),
              combinedCourseQuestFormat,
            );
            const dataForQuest = new DataForQuest({
              eligibility: new Eligibility({
                campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.STARTED }],
                passages: [
                  {
                    referenceId: moduleFromTargetProfile.id,
                    isTerminated: false,
                  },
                  {
                    referenceId: moduleFromQuest.id,
                    isTerminated: false,
                  },
                ],
              }),
            });

            // when
            combinedCourse.generateItems({
              itemDetails: [campaign, moduleFromTargetProfile, moduleFromQuest],
              recommendableModuleIds,
              recommendedModuleIdsForUser,
              encryptedCombinedCourseUrl,
              dataForQuest,
            });
            // then
            expect(combinedCourse.items).to.deep.equal([
              new CombinedCourseItem({
                id: campaign.id,
                reference: campaign.code,
                title: campaign.title,
                type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
                masteryRate: null,
                totalStagesCount: null,
                validatedStagesCount: null,
                isCompleted: false,
                isLocked: false,
              }),
              new CombinedCourseItem({
                id: 'formation_' + combinedCourse.quest.id + '_' + campaign.targetProfileId,
                reference: campaign.targetProfileId,
                type: COMBINED_COURSE_ITEM_TYPES.FORMATION,
                isLocked: true,
              }),
              new CombinedCourseItem({
                id: moduleFromQuest.id,
                reference: moduleFromQuest.slug,
                title: moduleFromQuest.title,
                type: COMBINED_COURSE_ITEM_TYPES.MODULE,
                redirection: encryptedCombinedCourseUrl,
                isCompleted: false,
                isLocked: true,
              }),
            ]);
          });
        });
      });

      it('should not take into account data that are not related to the quest', function () {
        // given
        const campaign1 = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 888 });
        const campaign2 = new Campaign({ id: 3, code: 'ABCDIAG2', title: 'diagnostique2' });

        const combinedCourseTemplate = new CombinedCourseTemplate({
          name: 'combinix',
          combinedCourseContent: [
            {
              type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              value: campaign1.targetProfileId,
            },
          ],
        });
        const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign1, campaign2]);
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          combinedCourseQuestFormat,
        );
        const dataForQuest = new DataForQuest({
          eligibility: new Eligibility({
            campaignParticipations: [{ campaignId: campaign1.id, status: CampaignParticipationStatuses.STARTED }],
          }),
        });

        // when
        combinedCourse.generateItems({ itemDetails: [campaign1, campaign2], dataForQuest });

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign1.id,
            reference: campaign1.code,
            title: campaign1.title,
            masteryRate: null,
            totalStagesCount: null,
            validatedStagesCount: null,
            type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
            isCompleted: false,
            isLocked: false,
          }),
        ]);
      });

      it('should keep success requirements order', function () {
        // given
        const campaign1 = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 888 });
        const campaign2 = new Campaign({ id: 3, code: 'ABCDIAG2', title: 'diagnostique2', targetProfileId: 999 });
        const module = new Module({ id: 'abc2de', title: 'title', slug: 'abcdef' });

        const combinedCourseTemplate = new CombinedCourseTemplate({
          name: 'combinix',
          combinedCourseContent: [
            {
              type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              value: campaign2.targetProfileId,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              value: campaign1.targetProfileId,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module.id,
            },
          ],
        });
        const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign1, campaign2]);
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          combinedCourseQuestFormat,
        );
        const dataForQuest = new DataForQuest({
          eligibility: new Eligibility({
            campaignParticipations: [
              { campaignId: campaign1.id, status: CampaignParticipationStatuses.STARTED },
              { campaignId: campaign2.id, status: CampaignParticipationStatuses.SHARED },
            ],
            passages: [],
          }),
        });
        const redirectionUrl = 'redirectionUrl';

        // when
        combinedCourse.generateItems({
          itemDetails: [campaign1, campaign2, module],
          encryptedCombinedCourseUrl: redirectionUrl,
          dataForQuest,
        });

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign2.id,
            reference: campaign2.code,
            title: campaign2.title,
            type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
            masteryRate: null,
            totalStagesCount: null,
            validatedStagesCount: null,
            isCompleted: true,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: campaign1.id,
            reference: campaign1.code,
            title: campaign1.title,
            type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
            masteryRate: null,
            totalStagesCount: null,
            validatedStagesCount: null,
            isCompleted: false,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: module.id,
            reference: module.slug,
            title: module.title,
            type: COMBINED_COURSE_ITEM_TYPES.MODULE,
            redirection: redirectionUrl,
            isCompleted: false,
            isLocked: true,
          }),
        ]);
      });

      it('should evaluates if module is completed', function () {
        // given
        const module = new Module({ id: 'abc2de', title: 'title', slug: 'abcdef' });

        const combinedCourseTemplate = new CombinedCourseTemplate({
          name: 'combinix',
          combinedCourseContent: [
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module.id,
            },
          ],
        });
        const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([]);
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          combinedCourseQuestFormat,
        );
        const dataForQuest = new DataForQuest({
          eligibility: new Eligibility({
            passages: [{ referenceId: module.id, isTerminated: true }],
          }),
        });

        // when
        combinedCourse.generateItems({
          itemDetails: [module],
          encryptedCombinedCourseUrl: 'redirectionUrl',
          dataForQuest,
        });
        const [moduleItem] = combinedCourse.items;

        // then
        expect(moduleItem.isCompleted).to.be.true;
      });

      describe('campaign completion', function () {
        it('returns masteryRate value and isCompleted to true on linked participation to combined course campaign', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 888 });

          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,

                value: campaign.targetProfileId,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );
          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              campaignParticipations: [
                { campaignId: campaign.id, status: CampaignParticipationStatuses.SHARED, masteryRate: 0.18 },
              ],
            }),
          });

          // when
          combinedCourse.generateItems({
            itemDetails: [campaign],
            encryptedCombinedCourseUrl: 'redirectionUrl',
            dataForQuest,
          });
          const [campaignItem] = combinedCourse.items;

          // then
          expect(campaignItem.isCompleted).to.be.true;
          expect(campaignItem.masteryRate).equal(0.18);
        });

        it('returns masteryRate to null and isCompleted to false on not linked participation to combined course campaign', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 888 });

          const combinedCourseTemplate = new CombinedCourseTemplate({
            name: 'combinix',
            combinedCourseContent: [
              {
                type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,

                value: campaign.targetProfileId,
              },
            ],
          });
          const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            combinedCourseQuestFormat,
          );
          const dataForQuest = new DataForQuest({
            eligibility: new Eligibility({
              campaignParticipations: [
                { campaignId: 9999, status: CampaignParticipationStatuses.SHARED, masteryRate: 0.18 },
              ],
            }),
          });

          // when
          combinedCourse.generateItems({
            itemDetails: [campaign],
            encryptedCombinedCourseUrl: 'redirectionUrl',
            dataForQuest,
          });
          const [campaignItem] = combinedCourse.items;

          // then
          expect(campaignItem.isCompleted).to.be.false;
          expect(campaignItem.masteryRate).null;
        });
      });

      it('should not mess with the combined course items', function () {
        // given
        const campaign1 = new Campaign({ id: 2, code: 'ABCDIAG1', title: 'diagnostique', targetProfileId: 888 });
        const campaign2 = new Campaign({ id: 3, code: 'ABCDIAG2', title: 'diagnostique2', targetProfileId: 999 });
        const module1 = new Module({ id: 'abcde1', title: 'module diag 1', slug: 'module-abcdef-1' });
        const module11 = new Module({ id: 'abcde2', title: 'module diag 1.1', slug: 'module-azerty-1.1' });
        const module2 = new Module({ id: 'abcde3', title: 'module diag 2', slug: 'module-querty-2' });
        const module22 = new Module({ id: 'abcde4', title: 'module diag 2.2', slug: 'module-osef-2-2' });

        const combinedCourseTemplate = new CombinedCourseTemplate({
          name: 'combinix',
          combinedCourseContent: [
            {
              type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              value: campaign2.targetProfileId,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module2.id,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module22.id,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              value: campaign1.targetProfileId,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module1.id,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module11.id,
            },
          ],
        });
        const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign1, campaign2]);
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          combinedCourseQuestFormat,
        );
        const dataForQuest = new DataForQuest({
          eligibility: new Eligibility({
            campaignParticipations: [
              { campaignId: campaign1.id, status: CampaignParticipationStatuses.SHARED, masteryRate: 0.21 },
              { campaignId: campaign2.id, status: CampaignParticipationStatuses.SHARED, masteryRate: 0.12 },
            ],
            passages: [
              { referenceId: module2.id, isTerminated: true },
              { referenceId: module22.id, isTerminated: true },
            ],
          }),
        });
        const redirectionUrl = 'redirectionUrl';

        // when
        combinedCourse.generateItems({
          recommendableModuleIds: [
            { moduleId: module1.id, targetProfileIds: [888, 999] },
            { moduleId: module11.id, targetProfileIds: [888, 999] },
            { moduleId: module2.id, targetProfileIds: [888, 999] },
            { moduleId: module22.id, targetProfileIds: [888, 999] },
          ],
          recommendedModuleIdsForUser: [
            { moduleId: module1.id },
            { moduleId: module11.id },
            { moduleId: module2.id },
            { moduleId: module22.id },
          ],
          itemDetails: [campaign1, campaign2, module1, module11, module2, module22],
          encryptedCombinedCourseUrl: redirectionUrl,
          dataForQuest,
        });

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign2.id,
            reference: campaign2.code,
            title: campaign2.title,
            type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
            masteryRate: 0.12,
            isCompleted: true,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: module2.id,
            reference: module2.slug,
            title: module2.title,
            type: COMBINED_COURSE_ITEM_TYPES.MODULE,
            redirection: redirectionUrl,
            isCompleted: true,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: module22.id,
            reference: module22.slug,
            title: module22.title,
            type: COMBINED_COURSE_ITEM_TYPES.MODULE,
            redirection: redirectionUrl,
            isCompleted: true,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: campaign1.id,
            reference: campaign1.code,
            title: campaign1.title,
            type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
            masteryRate: 0.21,
            isCompleted: true,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: module1.id,
            reference: module1.slug,
            title: module1.title,
            type: COMBINED_COURSE_ITEM_TYPES.MODULE,
            redirection: redirectionUrl,
            isCompleted: false,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: module11.id,
            reference: module11.slug,
            title: module11.title,
            type: COMBINED_COURSE_ITEM_TYPES.MODULE,
            redirection: redirectionUrl,
            isCompleted: false,
            isLocked: true,
          }),
        ]);
      });

      it('should identify module or campaign even if they  have a same id', function () {
        const campaign = new Campaign({ id: '3', code: 'ABCDIAG2', title: 'diagnostique2', targetProfileId: 999 });
        const module = new Module({ id: '3', title: 'module diag 1', slug: 'module-abcdef-1' });
        const combinedCourseTemplate = new CombinedCourseTemplate({
          name: 'combinix',
          combinedCourseContent: [
            {
              type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              value: campaign.targetProfileId,
            },
            {
              type: REQUIREMENT_TYPES.OBJECT.PASSAGES,
              value: module.id,
            },
          ],
        });
        const combinedCourseQuestFormat = combinedCourseTemplate.toCombinedCourseQuestFormat([campaign]);
        const combinedCourse = new CombinedCourseDetails(
          new CombinedCourse({ id, organizationId, name, code, questId }),
          combinedCourseQuestFormat,
        );
        const dataForQuest = new DataForQuest({
          eligibility: new Eligibility({
            campaignParticipations: [{ campaignId: campaign.id, status: CampaignParticipationStatuses.STARTED }],
            passages: [],
          }),
        });
        const redirectionUrl = 'redirectionUrl';

        // when
        combinedCourse.generateItems({
          itemDetails: [module, campaign],
          encryptedCombinedCourseUrl: redirectionUrl,
          dataForQuest,
        });
        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign.id,
            reference: campaign.code,
            title: campaign.title,
            type: COMBINED_COURSE_ITEM_TYPES.CAMPAIGN,
            masteryRate: null,
            isCompleted: false,
            isLocked: false,
          }),
          new CombinedCourseItem({
            id: module.id,
            reference: module.slug,
            title: module.title,
            type: COMBINED_COURSE_ITEM_TYPES.MODULE,
            redirection: redirectionUrl,
            isCompleted: false,
            isLocked: true,
          }),
        ]);
      });
    });

    describe('#status', function () {
      describe('when there is no participation', function () {
        it('should set status to NOT_STARTED', function () {
          // given
          const quest = {
            id: 1,
            code: 'abcdiag',
            organizationId: 1,
            name: 'name',
          };

          // when
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
          );

          // then
          expect(combinedCourse.status).to.deep.equal(CombinedCourseStatuses.NOT_STARTED);
        });
      });
      describe('when there is a participation', function () {
        it('should set status to STARTED if participation is STARTED', function () {
          // given
          const quest = {
            id: 1,
            code: 'abcdiag',
            organizationId: 1,
            name: 'name',
          };
          const participation = {
            status: CombinedCourseParticipationStatuses.STARTED,
          };

          // when
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
            participation,
          );

          // then
          expect(combinedCourse.status).to.deep.equal(CombinedCourseStatuses.STARTED);
        });

        it('should set status to COMPLETED if participation is COMPLETED', function () {
          // given
          const quest = {
            id: 1,
            code: 'abcdiag',
            organizationId: 1,
            name: 'name',
          };
          const participation = {
            status: CombinedCourseParticipationStatuses.COMPLETED,
          };

          // when
          const combinedCourse = new CombinedCourseDetails(
            new CombinedCourse({ id, organizationId, name, code, questId }),
            quest,
            participation,
          );

          // then
          expect(combinedCourse.status).to.deep.equal(CombinedCourseStatuses.COMPLETED);
        });
      });
    });
  });

  describe('CombinedCourse', function () {
    it('should return model with given parameters', function () {
      // given
      const id = 1;
      const organizationId = 1;
      const name = 'name';
      const code = 'code';

      // when
      const combinedCourse = new CombinedCourse({ id, organizationId, name, code, questId: 2 });

      // then
      expect(combinedCourse.code).to.deep.equal(code);
      expect(combinedCourse.name).to.deep.equal(name);
      expect(combinedCourse.organizationId).to.deep.equal(organizationId);
      expect(combinedCourse.id).to.deep.equal(id);
      expect(combinedCourse.questId).to.deep.equal(2);
    });

    it('should throw when combined course model does not pass validation', function () {
      // given
      const id = 1;
      const organizationId = 1;
      const name = 'name';
      const code = 123;

      // when
      expect(() => {
        new CombinedCourse({ id, organizationId, name, code });
      }).to.throw();
    });

    describe('#participationsCount', function () {
      it('should return 0 when there are no participations', function () {
        // given
        const combinedCourse = new CombinedCourse({ id: 1, organizationId: 1, name: 'name', code: 'code' });

        // when
        const count = combinedCourse.participationsCount;

        // then
        expect(count).to.equal(0);
      });

      it('should return the number of participations', function () {
        // given
        const combinedCourse = new CombinedCourse({ id: 1, organizationId: 1, name: 'name', code: 'code' });
        combinedCourse.participations = [
          new CombinedCourseParticipation({
            id: 1,
            questId: 1,
            organizationLearnerId: 1,
            status: CombinedCourseParticipationStatuses.STARTED,
          }),
          new CombinedCourseParticipation({
            id: 2,
            questId: 1,
            organizationLearnerId: 2,
            status: CombinedCourseParticipationStatuses.STARTED,
          }),
          new CombinedCourseParticipation({
            id: 3,
            questId: 1,
            organizationLearnerId: 3,
            status: CombinedCourseParticipationStatuses.STARTED,
          }),
        ];

        // when
        const count = combinedCourse.participationsCount;

        // then
        expect(count).to.equal(3);
      });
    });

    describe('#completedParticipationsCount', function () {
      it('should return the number of completed participations', function () {
        // given
        const combinedCourse = new CombinedCourse({ id: 1, organizationId: 1, name: 'name', code: 'code' });
        combinedCourse.participations = [
          new CombinedCourseParticipation({
            id: 1,
            questId: 1,
            organizationLearnerId: 1,
            status: CombinedCourseParticipationStatuses.COMPLETED,
          }),
          new CombinedCourseParticipation({
            id: 2,
            questId: 1,
            organizationLearnerId: 2,
            status: CombinedCourseParticipationStatuses.STARTED,
          }),
          new CombinedCourseParticipation({
            id: 3,
            questId: 1,
            organizationLearnerId: 3,
            status: CombinedCourseParticipationStatuses.COMPLETED,
          }),
        ];

        // when
        const count = combinedCourse.completedParticipationsCount;

        // then
        expect(count).to.equal(2);
      });
    });
  });
});
