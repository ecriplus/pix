import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../../../src/prescription/shared/domain/constants.js';
import { Campaign } from '../../../../../src/quest/domain/models/Campaign.js';
import { CombinedCourse, CombinedCourseDetails } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseItem } from '../../../../../src/quest/domain/models/CombinedCourseItem.js';
import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | CombinedCourse ', function () {
  describe('CombinedCourseDetails', function () {
    describe('#campaignIds', function () {
      it('should return ids of all campaigns included in the given combined course', function () {
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
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        const campaignIds = combinedCourse.campaignIds;

        // then
        expect(campaignIds).to.deep.equal([campaignId]);
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
          new CombinedCourseItem({ id: campaign.id, reference: campaign.code, title: campaign.name }),
        ]);
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
          new CombinedCourseItem({ id: campaign1.id, reference: campaign1.code, title: campaign1.name }),
        ]);
      });

      it('should keep success requirements order', function () {
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
          ],
        });
        const combinedCourse = new CombinedCourseDetails(new CombinedCourse(), quest);

        // when
        combinedCourse.generateItems([campaign1, campaign2]);

        // then
        expect(combinedCourse.items).to.deep.equal([
          new CombinedCourseItem({ id: campaign2.id, reference: campaign2.code, title: campaign2.name }),
          new CombinedCourseItem({ id: campaign1.id, reference: campaign1.code, title: campaign1.name }),
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
