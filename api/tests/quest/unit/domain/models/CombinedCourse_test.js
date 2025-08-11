import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../../../src/prescription/shared/domain/constants.js';
import { Campaign } from '../../../../../src/quest/domain/models/Campaign.js';
import { CombinedCourse, CombinedCourseDetails } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseItem, ITEM_TYPE } from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import { DataForQuest } from '../../../../../src/quest/domain/models/DataForQuest.js';
import { Eligibility } from '../../../../../src/quest/domain/models/Eligibility.js';
import { Module } from '../../../../../src/quest/domain/models/Module.js';
import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourse ', function () {
  describe('CombinedCourseDetails', function () {
    describe('#campaignIds', function () {
      it('should only return ids of all campaigns included in the given combined course', function () {
        // given
        const campaignId = 2;
        const quest = new Quest({
          id: 1,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: campaignId,
                  comparison: 'equal',
                },
              },
            },
            {
              requirement_type: 'passages',
              comparison: 'all',
              data: {
                moduleId: {
                  data: 7,
                  comparison: 'equal',
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        const campaignIds = combinedCourse.campaignIds;

        // then
        expect(campaignIds).to.deep.equal([campaignId]);
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
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: 2,
                  comparison: 'equal',
                },
              },
            },
            {
              requirement_type: 'passages',
              comparison: 'all',
              data: {
                moduleId: {
                  data: moduleId,
                  comparison: 'equal',
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        const moduleIds = combinedCourse.moduleIds;

        // then
        expect(moduleIds).to.deep.equal([moduleId]);
      });
    });

    describe('#isCompleted', function () {
      describe('when items are type campaignParticipations', function () {
        it('returns true when every participations are shared', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
          const secondCampaign = new Campaign({ id: 3, code: 'ABCDIAG2', name: 'diagnostique2' });

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'campaignParticipations',
                comparison: 'all',
                data: {
                  campaignId: {
                    data: campaign.id,
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
                    data: secondCampaign.id,
                    comparison: 'equal',
                  },
                  status: {
                    data: 'SHARED',
                    comparison: 'equal',
                  },
                },
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: 'SHARED',
              },
              {
                campaignId: secondCampaign.id,

                status: 'SHARED',
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.true;
        });
        it('returns false when some participations are not shared', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
          const secondCampaign = new Campaign({ id: 3, code: 'ABCDIAG2', name: 'diagnostique2' });

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'campaignParticipations',
                comparison: 'all',
                data: {
                  campaignId: {
                    data: campaign.id,
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
                    data: secondCampaign.id,
                    comparison: 'equal',
                  },
                  status: {
                    data: 'SHARED',
                    comparison: 'equal',
                  },
                },
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: 'STARTED',
              },
              {
                campaignId: secondCampaign.id,

                status: 'SHARED',
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

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
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: firstModuleId,
                    comparison: 'equal',
                  },
                  isTerminated: {
                    data: true,
                    comparison: 'equal',
                  },
                },
              },
              {
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: secondModuleId,
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
          const eligibility = new Eligibility({
            passages: [
              {
                id: firstModuleId,
                status: 'COMPLETED',
              },
              {
                id: secondModuleId,
                status: 'COMPLETED',
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

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
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: firstModuleId,
                    comparison: 'equal',
                  },
                  isTerminated: {
                    data: true,
                    comparison: 'equal',
                  },
                },
              },
              {
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: secondModuleId,
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
          const eligibility = new Eligibility({
            passages: [
              {
                id: firstModuleId,
                status: 'COMPLETED',
              },
              {
                id: secondModuleId,
                status: 'STARTED',
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.false;
        });
      });

      describe('when items are mixed', function () {
        it('returns true when all modules and campaignParticipations are done', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
          const moduleId = 1;

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'campaignParticipations',
                comparison: 'all',
                data: {
                  campaignId: {
                    data: campaign.id,
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
                    data: moduleId,
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
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: 'SHARED',
              },
            ],
            passages: [
              {
                id: moduleId,
                status: 'COMPLETED',
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.true;
        });
        it('returns false when some modules and campaignParticipations are not done', function () {
          // given
          const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
          const moduleId = 1;

          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'campaignParticipations',
                comparison: 'all',
                data: {
                  campaignId: {
                    data: campaign.id,
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
                    data: moduleId,
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
          const eligibility = new Eligibility({
            campaignParticipations: [
              {
                campaignId: campaign.id,
                status: 'STARTED',
              },
            ],
            passages: [
              {
                id: moduleId,
                status: 'STARTED',
              },
            ],
          });
          const dataForQuest = new DataForQuest({ eligibility });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

          // when
          const result = combinedCourse.isCompleted(dataForQuest);

          // then
          expect(result).to.be.false;
        });

        describe('when there are recommandable modules', function () {
          it('returns true when recommended modules are done', function () {
            // given
            const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
            const moduleId = 1;
            const notRecommendedModuleId = 2;

            const quest = new Quest({
              id: 1,
              rewardId: null,
              rewardType: null,
              eligibilityRequirements: [],
              successRequirements: [
                {
                  requirement_type: 'campaignParticipations',
                  comparison: 'all',
                  data: {
                    campaignId: {
                      data: campaign.id,
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
                      data: moduleId,
                      comparison: 'equal',
                    },
                    isTerminated: {
                      data: true,
                      comparison: 'equal',
                    },
                  },
                },
                {
                  requirement_type: 'passages',
                  comparison: 'all',
                  data: {
                    moduleId: {
                      data: notRecommendedModuleId,
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
            const eligibility = new Eligibility({
              campaignParticipations: [
                {
                  campaignId: campaign.id,
                  status: 'SHARED',
                },
              ],
              passages: [
                {
                  id: moduleId,
                  status: 'COMPLETED',
                },
                {
                  id: notRecommendedModuleId,
                  status: 'STARTED',
                },
              ],
            });
            const dataForQuest = new DataForQuest({ eligibility });
            const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

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
            const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
            const moduleId = 1;
            const notRecommendedModuleId = 2;

            const quest = new Quest({
              id: 1,
              rewardId: null,
              rewardType: null,
              eligibilityRequirements: [],
              successRequirements: [
                {
                  requirement_type: 'campaignParticipations',
                  comparison: 'all',
                  data: {
                    campaignId: {
                      data: campaign.id,
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
                      data: moduleId,
                      comparison: 'equal',
                    },
                    isTerminated: {
                      data: true,
                      comparison: 'equal',
                    },
                  },
                },
                {
                  requirement_type: 'passages',
                  comparison: 'all',
                  data: {
                    moduleId: {
                      data: notRecommendedModuleId,
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
            const eligibility = new Eligibility({
              campaignParticipations: [
                {
                  campaignId: campaign.id,
                  status: 'SHARED',
                },
              ],
              passages: [
                {
                  id: moduleId,
                  status: 'STARTED',
                },
                {
                  id: notRecommendedModuleId,
                  status: 'STARTED',
                },
              ],
            });
            const dataForQuest = new DataForQuest({ eligibility });
            const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

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
      it('returns a combined course item for provided campaign', function () {
        // given
        const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });

        const quest = new Quest({
          id: 1,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: campaign.id,
                  comparison: 'equal',
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        combinedCourse.generateItems([campaign]);

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign.id,
            reference: campaign.code,
            title: campaign.name,
            type: ITEM_TYPE.CAMPAIGN,
          }),
        ]);
      });
      it('should not take encryptedCombinedCourseUrl if item type is campaign', function () {
        // given
        const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
        const campaign = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
        const quest = new Quest({
          id: 1,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: campaign.id,
                  comparison: 'equal',
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        combinedCourse.generateItems([campaign], [], [], encryptedCombinedCourseUrl);

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign.id,
            reference: campaign.code,
            title: campaign.name,
            type: ITEM_TYPE.CAMPAIGN,
            redirection: undefined,
          }),
        ]);
      });

      describe('when items are type module', function () {
        it('should return module if it is in quest but not is not in target profile', function () {
          // given
          const recommendableModuleIds = [];
          const recommendedModuleIdsForUser = [];
          const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: 7,
                    comparison: 'equal',
                  },
                },
              },
            ],
          });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);
          const module = new Module({ id: 7, title: 'module' });

          // when
          combinedCourse.generateItems(
            [module],
            recommendableModuleIds,
            recommendedModuleIdsForUser,
            encryptedCombinedCourseUrl,
          );

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: module.id,
              reference: module.slug,
              title: module.title,
              type: ITEM_TYPE.MODULE,
              redirection: encryptedCombinedCourseUrl,
            }),
          ]);
        });
        it('should not return module if it is recommandable, but not recommended for user', function () {
          // given
          const module = new Module({ id: 1, title: 'module' });
          const campaign = domainBuilder.buildCampaign({ id: 777, targetProfileId: 888 });
          const recommendableModuleIds = [{ moduleId: module.id, targetProfileIds: [campaign.targetProfileId] }];
          const recommendedModuleIdsForUser = [];
          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'campaignParticipations',
                comparison: 'all',
                data: {
                  campaignId: {
                    data: campaign.id,
                    comparison: 'equal',
                  },
                },
              },
              {
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: module.id,
                    comparison: 'equal',
                  },
                },
              },
            ],
          });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

          // when
          combinedCourse.generateItems([campaign, module], recommendableModuleIds, recommendedModuleIdsForUser);

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.name,
              type: ITEM_TYPE.CAMPAIGN,
            }),
          ]);
        });
        it('should return module if it in quest, recommandable and recommended for user', function () {
          // given
          const encryptedCombinedCourseUrl = 'encryptedCombinedCourseUrl';
          const module = new Module({ id: 1, title: 'module' });
          const campaign = domainBuilder.buildCampaign({ id: 777, targetProfileId: 888 });

          const recommendableModuleIds = [{ moduleId: module.id }];
          const recommendedModuleIdsForUser = [{ moduleId: module.id }];
          const quest = new Quest({
            id: 1,
            rewardId: null,
            rewardType: null,
            eligibilityRequirements: [],
            successRequirements: [
              {
                requirement_type: 'campaignParticipations',
                comparison: 'all',
                data: {
                  campaignId: {
                    data: campaign.id,
                    comparison: 'equal',
                  },
                },
              },
              {
                requirement_type: 'passages',
                comparison: 'all',
                data: {
                  moduleId: {
                    data: module.id,
                    comparison: 'equal',
                  },
                },
              },
            ],
          });
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

          // when
          combinedCourse.generateItems(
            [campaign, module],
            recommendableModuleIds,
            recommendedModuleIdsForUser,
            encryptedCombinedCourseUrl,
          );

          // then
          expect(combinedCourse.items).to.deep.equal([
            new CombinedCourseItem({
              id: campaign.id,
              reference: campaign.code,
              title: campaign.name,
              type: ITEM_TYPE.CAMPAIGN,
            }),
            new CombinedCourseItem({
              id: module.id,
              reference: module.slug,
              title: module.title,
              type: ITEM_TYPE.MODULE,
              redirection: encryptedCombinedCourseUrl,
            }),
          ]);
        });
      });

      it('should not take into account data that are not related to the quest', function () {
        // given
        const campaign1 = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
        const campaign2 = new Campaign({ id: 3, code: 'ABCDIAG2', name: 'diagnostique2' });

        const quest = new Quest({
          id: 1,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: campaign1.id,
                  comparison: 'equal',
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        combinedCourse.generateItems([campaign1, campaign2]);

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign1.id,
            reference: campaign1.code,
            title: campaign1.name,
            type: ITEM_TYPE.CAMPAIGN,
          }),
        ]);
      });

      it('should keep success requirements order', function () {
        // given
        const campaign1 = new Campaign({ id: 2, code: 'ABCDIAG1', name: 'diagnostique' });
        const campaign2 = new Campaign({ id: 3, code: 'ABCDIAG2', name: 'diagnostique2' });
        const module = new Module({ id: 7, title: 'title', slug: 'abcdef' });

        const quest = new Quest({
          id: 1,
          rewardId: null,
          rewardType: null,
          eligibilityRequirements: [],
          successRequirements: [
            {
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: campaign2.id,
                  comparison: 'equal',
                },
              },
            },
            {
              requirement_type: 'campaignParticipations',
              comparison: 'all',
              data: {
                campaignId: {
                  data: campaign1.id,
                  comparison: 'equal',
                },
              },
            },
            {
              requirement_type: 'passages',
              comparison: 'all',
              data: {
                moduleId: {
                  data: 7,
                  comparison: 'equal',
                },
              },
            },
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        combinedCourse.generateItems([campaign1, campaign2, module]);

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({
            id: campaign2.id,
            reference: campaign2.code,
            title: campaign2.name,
            type: ITEM_TYPE.CAMPAIGN,
          }),
          new CombinedCourseItem({
            id: campaign1.id,
            reference: campaign1.code,
            title: campaign1.name,
            type: ITEM_TYPE.CAMPAIGN,
          }),
          new CombinedCourseItem({
            id: module.id,
            reference: module.slug,
            title: module.title,
            type: ITEM_TYPE.MODULE,
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
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

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
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest, participation);

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
          const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest, participation);

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
      const combinedCourse = new CombinedCourse({ id, organizationId, name, code });

      // then
      expect(combinedCourse.code).to.deep.equal(code);
      expect(combinedCourse.name).to.deep.equal(name);
      expect(combinedCourse.organizationId).to.deep.equal(organizationId);
      expect(combinedCourse.id).to.deep.equal(id);
    });
  });
});
