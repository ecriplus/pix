import sinon from 'sinon';

import { SixthGradeOrganizationShare } from '../../../../src/profile/scripts/sixth-grade-organization-share.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../test-helper.js';

describe('Integration | Profile | Scripts | sixth-grade-organization-share  ', function () {
  describe('options', function () {
    it('parses dates correctly', function () {
      const realDate = '2024-01-01';
      const script = new SixthGradeOrganizationShare();
      const { options } = script.metaInfo;
      const parsedStartDate = options.start.coerce(realDate);
      const parsedEndDate = options.end.coerce(realDate);
      expect(parsedStartDate).to.be.a.instanceOf(Date);
      expect(parsedEndDate).to.be.a.instanceOf(Date);
    });

    it('throw when dates are not correct', function () {
      const invalidDate = [];
      const script = new SixthGradeOrganizationShare();
      const { options } = script.metaInfo;
      expect(() => options.start.coerce(invalidDate)).to.throw();
      expect(() => options.end.coerce(invalidDate)).to.throw();
    });

    it('should throw when end date is before the start date', async function () {
      const startDate = '2024-01-01';
      const endDate = '2023-01-01';
      const script = new SixthGradeOrganizationShare();
      const result = await catchErr(script.handle)(startDate, endDate);

      expect(result).instanceOf(Error);
    });
  });

  describe('#handle', function () {
    let organizationProfileRewards;
    let logger;
    let profileRewardIds;
    let firstOrganizationId;
    let secondOrganizationId;

    before(async function () {
      // build attestation
      const attestation = databaseBuilder.factory.buildAttestation();

      // build users
      const userIds = [...Array(8).keys()].map((id) => databaseBuilder.factory.buildUser({ id: id + 1 }).id);

      // build organizations
      firstOrganizationId = databaseBuilder.factory.buildOrganization().id;
      secondOrganizationId = databaseBuilder.factory.buildOrganization().id;

      // build organization learners
      userIds.forEach((userId) =>
        databaseBuilder.factory.buildOrganizationLearner({ organizationId: firstOrganizationId, userId }),
      );

      // build another organization learner for userId 4
      databaseBuilder.factory.buildOrganizationLearner({ organizationId: secondOrganizationId, userId: 4 });

      // build profile rewards
      profileRewardIds = userIds.map(
        (userId) =>
          databaseBuilder.factory.buildProfileReward({
            rewardId: attestation.id,
            userId,
            createdAt: `2024-01-0${userId}`,
          }).id,
      );

      // build one organization profile reward to test unique constraint violation
      databaseBuilder.factory.buildOrganizationProfileReward({
        profileRewardId: profileRewardIds[5],
        organizationId: firstOrganizationId,
      });

      await databaseBuilder.commit();

      const script = new SixthGradeOrganizationShare();
      logger = { info: sinon.spy(), warn: sinon.spy() };

      await script.handle({
        options: {
          start: '2024-01-02',
          end: '2024-01-08',
        },
        logger,
      });

      organizationProfileRewards = await knex('organizations-profile-rewards').select('*');
    });

    it('should handle start and end date option', async function () {
      const organizationProfilRewardIds = organizationProfileRewards.map(
        (profileReward) => profileReward.profileRewardId,
      );

      expect(organizationProfilRewardIds).to.not.contains(profileRewardIds[0]);
      expect(organizationProfilRewardIds).to.not.contains(profileRewardIds[8]);
    });

    it('should handle pgsql unique constraint violation error', async function () {
      expect(logger.warn).to.have.been.calledOnceWithExactly(
        `User 6 already shared an attestation with organization ${firstOrganizationId}`,
      );
    });

    it('should insert expected data', async function () {
      const organizationProfileRewardsWithoutIds = organizationProfileRewards.map((organizationProfileReward) => {
        delete organizationProfileReward.id;
        return organizationProfileReward;
      });

      expect(organizationProfileRewardsWithoutIds).to.have.deep.members([
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[1] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[2] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[3] },
        { organizationId: secondOrganizationId, profileRewardId: profileRewardIds[3] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[4] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[5] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[6] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[7] },
      ]);
    });
  });
});
