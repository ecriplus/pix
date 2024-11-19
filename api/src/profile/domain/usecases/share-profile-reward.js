import { ProfileRewardCantBeSharedError } from '../errors.js';

export const shareProfileReward = async function ({
  userId,
  profileRewardId,
  campaignParticipationId,
  profileRewardRepository,
  organizationProfileRewardRepository,
  campaignParticipationRepository,
}) {
  const profileReward = await profileRewardRepository.getById({ profileRewardId });

  if (profileReward?.userId !== userId) {
    throw new ProfileRewardCantBeSharedError();
  }

  const campaign = await campaignParticipationRepository.getCampaignByParticipationId({ campaignParticipationId });

  await organizationProfileRewardRepository.save({
    organizationId: campaign.organizationId,
    profileRewardId,
  });
};
