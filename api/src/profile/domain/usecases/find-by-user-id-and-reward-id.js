export const findByUserIdAndRewardId = ({ rewardId, userId, profileRewardRepository }) => {
  return profileRewardRepository.findByUserIdAndRewardId({ rewardId, userId });
};
