import sinon from 'sinon';

import { CampaignParticipationStatuses } from '../../../../src/prescription/shared/domain/constants.js';
import {
  AttestationRewardRecoveryScript,
  TARGET_PROFILE_IDS,
} from '../../../../src/profile/scripts/attestation-reward-recovery.js';
import { catchErr, databaseBuilder, expect } from '../../../test-helper.js';

describe('Integration | Profile | Scripts | sixth-grade-attestation-reward', function () {
  describe('options', function () {
    it('parses dates correctly', function () {
      const startDate = '2024-01-01';
      const endDate = { whut: 'idontknow' };
      const script = new AttestationRewardRecoveryScript();
      const { options } = script.metaInfo;
      const parsedDate = options.start.coerce(startDate);
      expect(parsedDate).to.be.a.instanceOf(Date);
      expect(() => options.end.coerce(endDate)).to.throw();
    });
  });

  describe('#fetchUsers', function () {
    let script;

    beforeEach(async function () {
      script = new AttestationRewardRecoveryScript();
    });

    it('should not return the user if the participation date is not included between the start date and the end date ', async function () {
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[0],
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId });
      const { userId } = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        createdAt: '2024-12-02',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        createdAt: '2024-12-07',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        createdAt: '2024-11-22',
      });

      await databaseBuilder.commit();
      const userIds = await script.fetchUserIds(new Date('2024-12-01'), new Date('2024-12-03'));
      expect(userIds).to.have.lengthOf(1);
      expect(userIds).to.contains(userId);
    });

    it('should only return the user if participation status is different than started', async function () {
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[0],
      });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId });
      const { userId } = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.STARTED,
        createdAt: '2024-12-02',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.SHARED,
        createdAt: '2024-12-02',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-02',
      });

      await databaseBuilder.commit();
      const userIds = await script.fetchUserIds(new Date('2024-12-01'), new Date('2024-12-06'));
      expect(userIds).to.have.lengthOf(2);
      expect(userIds).to.not.contains(userId);
    });

    it('should not return the user if the campaign target profile is not included in targeted target profiles', async function () {
      const { id: targetProfileId1 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[0],
      });
      const { id: targetProfileId2 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[1],
      });
      const { id: targetProfileId3 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[2],
      });
      const { id: targetProfileId4 } = databaseBuilder.factory.buildTargetProfile();
      const campaign1 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId1 });
      const campaign2 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId2 });
      const campaign3 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId3 });
      const campaign4 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId4 });
      const otherParameters = { status: CampaignParticipationStatuses.SHARED, createdAt: '2024-12-02T15:07:57.376Z' };
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign1.id,
        ...otherParameters,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign2.id,
        ...otherParameters,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        ...otherParameters,
      });
      const { userId: otherTargetProfileCampaignParticipationUserId } =
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign4.id,
          ...otherParameters,
        });

      await databaseBuilder.commit();
      const userIds = await script.fetchUserIds(new Date('2024-12-01'), new Date('2024-12-06'));
      expect(userIds).to.have.lengthOf(3);
      expect(userIds).to.not.contains(otherTargetProfileCampaignParticipationUserId);
    });

    it('should return a user only once if the user has several participations for several campaigns including the targeted target profiles', async function () {
      const { id: targetProfileId1 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[0],
      });
      const { id: targetProfileId2 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[1],
      });
      const { id: targetProfileId3 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[2],
      });

      const user = databaseBuilder.factory.buildUser();
      const campaign1 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId1 });
      const campaign2 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId2 });
      const campaign3 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId3 });

      const otherParameters = {
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-02T15:07:57.376Z',
        userId: user.id,
      };
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign1.id,
        ...otherParameters,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign2.id,
        ...otherParameters,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        ...otherParameters,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-02T15:07:57.376Z',
      });

      await databaseBuilder.commit();
      const userIds = await script.fetchUserIds(new Date('2024-12-01'), new Date('2024-12-06'));
      expect(userIds).to.have.lengthOf(2);
      expect(userIds).to.contains(user.id);
    });

    it('should return expected users', async function () {
      const { id: targetProfileId1 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[0],
      });
      const { id: targetProfileId2 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[1],
      });
      const { id: targetProfileId3 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[2],
      });
      const campaign1 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId1 });
      const campaign2 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId2 });
      const campaign3 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId3 });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign1.id,
        status: CampaignParticipationStatuses.SHARED,
        createdAt: '2024-12-01T00:00:01.376Z',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign2.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-07T15:07:57.376Z',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-07T23:59:59.376Z',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-31T21:22:00.001Z',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2025-01-01T21:22:00.001Z',
      });

      await databaseBuilder.commit();
      const userIds = await script.fetchUserIds(new Date('2024-12-01'), new Date('2024-12-31'));
      expect(userIds).to.have.lengthOf(4);
    });
  });

  describe('#handle', function () {
    it('should log information for each userId', async function () {
      const { id: targetProfileId1 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[2],
      });
      const { id: targetProfileId2 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[0],
      });
      const { id: targetProfileId3 } = databaseBuilder.factory.buildTargetProfile({
        id: TARGET_PROFILE_IDS[1],
      });
      const campaign1 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId1 });
      const campaign2 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId2 });
      const campaign3 = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfileId3 });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign1.id,
        status: CampaignParticipationStatuses.SHARED,
        createdAt: '2024-12-01',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign2.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-02',
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign3.id,
        status: CampaignParticipationStatuses.TO_SHARE,
        createdAt: '2024-12-03',
      });

      await databaseBuilder.commit();

      const script = new AttestationRewardRecoveryScript();
      const logger = { info: sinon.spy(), error: sinon.spy() };
      const usecases = { rewardUser: sinon.stub() };

      await script.handle({
        options: {
          start: new Date('2024-12-01'),
          end: new Date('2024-12-07'),
        },
        logger,
        rewardUser: usecases.rewardUser,
      });

      expect(logger.info.callCount).to.equal(4);
    });

    it('should throw an error if end comes before start.', async function () {
      const script = new AttestationRewardRecoveryScript();
      const logger = { info: sinon.spy(), error: sinon.spy() };
      const usecases = { rewardUser: sinon.stub() };

      const error = await catchErr(script.handle)({
        options: {
          start: new Date('2024-11-10'),
          end: new Date('2024-11-09'),
        },
        logger,
        rewardUser: usecases.rewardUser,
      });

      expect(error).to.be.an.instanceOf(Error);
    });

    it('should stop execution if there are no users', async function () {
      const script = new AttestationRewardRecoveryScript();
      const logger = { info: sinon.spy(), error: sinon.spy() };
      const usecases = { rewardUser: sinon.stub() };

      await script.handle({
        options: {
          start: new Date('2024-12-01'),
          end: new Date('2024-12-09'),
        },
        logger,
        rewardUser: usecases.rewardUser,
      });

      expect(usecases.rewardUser).to.not.have.been.called;
      expect(logger.info).to.have.been.calledOnceWithExactly('No user found');
    });
  });
});
