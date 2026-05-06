import { ProfileReward } from '../../../../src/profile/domain/models/ProfileReward.js';
import { REWARD_TYPES } from '../../../../src/quest/domain/constants.js';

const buildProfileReward = function ({
  id = 678,
  rewardId = 987,
  rewardType = REWARD_TYPES.ATTESTATION,
  createdAt = new Date(),
  userId = 123,
} = {}) {
  return new ProfileReward({ id, rewardId, rewardType, createdAt, userId });
};

export { buildProfileReward };
