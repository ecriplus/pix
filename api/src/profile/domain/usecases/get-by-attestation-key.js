export const getByAttestationKey = async ({ key, rewardRepository }) => {
  return rewardRepository.getByAttestationKey({ key });
};
