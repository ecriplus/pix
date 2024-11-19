import { ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME } from '../../../../../db/migrations/20241118134739_create-organizations-profile-rewards-table.js';
import { save } from '../../../../../src/profile/infrastructure/repositories/organization-profile-reward-repository.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Profile | Integration | Infrastructure | Repository | organizations-profile-rewards-repository', function () {
  describe('#save', function () {
    it('should save organization profile reward', async function () {
      // given
      const profileReward = databaseBuilder.factory.buildProfileReward();
      const organization = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();

      // when
      await save({ organizationId: organization.id, profileRewardId: profileReward.id });

      // then
      const organizationProfileReward = await knex(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME).where({
        organizationId: organization.id,
        profileRewardId: profileReward.id,
      });
      expect(organizationProfileReward).to.have.lengthOf(1);
    });

    it('should save organization profile reward for other profile reward id but for the same organization', async function () {
      // given
      const profileReward = databaseBuilder.factory.buildProfileReward();
      const otherProfileReward = databaseBuilder.factory.buildProfileReward({ rewardId: 11 });
      const organization = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationsProfileRewards({
        organizationId: organization.id,
        profileRewardId: profileReward.id,
      });

      await databaseBuilder.commit();

      // when
      await save({ organizationId: organization.id, profileRewardId: otherProfileReward.id });

      // then
      const organizationProfileReward = await knex(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME)
        .select('profileRewardId')
        .where({
          organizationId: organization.id,
        });
      expect(organizationProfileReward).to.have.lengthOf(2);
      expect(organizationProfileReward).to.have.deep.members([
        { profileRewardId: profileReward.id },
        { profileRewardId: otherProfileReward.id },
      ]);
    });

    it('should do nothing if profile reward is already existing for same organization', async function () {
      // given
      const profileReward = databaseBuilder.factory.buildProfileReward();
      const organization = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationsProfileRewards({
        organizationId: organization.id,
        profileRewardId: profileReward.id,
      });
      await databaseBuilder.commit();

      // when
      await save({ organizationId: organization.id, profileRewardId: profileReward.id });

      // then
      const organizationProfileReward = await knex(ORGANIZATIONS_PROFILE_REWARDS_TABLE_NAME).where({
        organizationId: organization.id,
        profileRewardId: profileReward.id,
      });
      expect(organizationProfileReward).to.have.lengthOf(1);
    });
  });
});
