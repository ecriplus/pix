import { AttestationNotFoundError } from '../errors.js';
import { AttestationUserDetail } from '../models/AttestationUserDetail.js';

export async function getSharedAttestationsUserDetailByOrganizationId({
  attestationKey,
  organizationId,
  profileRewardRepository,
  attestationRepository,
  organizationProfileRewardRepository,
}) {
  const attestationData = await attestationRepository.getByKey({ attestationKey });

  if (!attestationData) {
    throw new AttestationNotFoundError();
  }

  const sharedProfileRewards = await organizationProfileRewardRepository.getByOrganizationId({
    attestationKey,
    organizationId,
  });
  const profileRewardIds = sharedProfileRewards.map((sharedProfileReward) => sharedProfileReward.profileRewardId);

  const profileRewards = await profileRewardRepository.getByIds({ profileRewardIds });

  return profileRewards.map((profileReward) => {
    return new AttestationUserDetail({
      attestationKey,
      obtainedAt: profileReward.createdAt,
      userId: profileReward.userId,
    });
  });
}
