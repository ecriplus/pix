export const findByUserIdAndRewardId = async ({ rewardId, userId, profileRewardApi }) => {
  return profileRewardApi.findByUserIdAndRewardId({ rewardId, userId });
};
