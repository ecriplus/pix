import sinon from 'sinon';

import { SixthGradeOrganizationShare } from '../../../../src/profile/scripts/sixth-grade-organization-share.js';
import { databaseBuilder, expect, knex } from '../../../test-helper.js';

describe('Integration | Profile | Scripts | sixth-grade-organization-share  ', function () {
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

      // build another organization learner for userId 3
      databaseBuilder.factory.buildOrganizationLearner({ organizationId: secondOrganizationId, userId: 3 });

      // build profile rewards
      profileRewardIds = userIds.map(
        (userId) => databaseBuilder.factory.buildProfileReward({ rewardId: attestation.id, userId }).id,
      );

      // build one organization profile reward to test unique constraint violation
      databaseBuilder.factory.buildOrganizationProfileReward({
        profileRewardId: profileRewardIds[4],
        organizationId: firstOrganizationId,
      });

      await databaseBuilder.commit();

      const script = new SixthGradeOrganizationShare();
      logger = { info: sinon.spy(), warn: sinon.spy() };

      await script.handle({
        options: {
          limit: 5,
          offset: 2,
        },
        logger,
      });

      organizationProfileRewards = await knex('organizations-profile-rewards').select('*');
    });

    it('should handle offset option', async function () {
      const organizationProfilRewardIds = organizationProfileRewards.map(
        (profileReward) => profileReward.profileRewardId,
      );
      expect(organizationProfilRewardIds).to.not.contains(profileRewardIds[0]);
      expect(organizationProfilRewardIds).to.not.contains(profileRewardIds[1]);
    });

    it('should handle limit option', async function () {
      const organizationProfilRewardIds = organizationProfileRewards.map(
        (profileReward) => profileReward.profileRewardId,
      );
      expect(organizationProfilRewardIds).to.not.contains(profileRewardIds[7]);
      expect(organizationProfilRewardIds).to.not.contains(profileRewardIds[8]);
    });

    it('should handle pgsql unique constraint violation error', async function () {
      expect(logger.warn).to.have.been.calledOnceWithExactly(
        `User 5 already shared an attestation with organization ${firstOrganizationId}`,
      );
    });

    it('should insert expected data', async function () {
      const organizationProfileRewardsWithoutIds = organizationProfileRewards.map((organizationProfileReward) => {
        delete organizationProfileReward.id;
        return organizationProfileReward;
      });

      expect(organizationProfileRewardsWithoutIds).to.have.deep.members([
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[2] },
        { organizationId: secondOrganizationId, profileRewardId: profileRewardIds[2] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[3] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[4] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[5] },
        { organizationId: firstOrganizationId, profileRewardId: profileRewardIds[6] },
      ]);
    });
  });
});
