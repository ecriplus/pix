import { AttestationNotFoundError } from '../errors.js';
import { AttestationUserDetail } from '../models/AttestationUserDetail.js';

export async function getSharedAttestationsUserDetailByOrganizationId({
  attestationKey,
  organizationId,
  profileRewardRepository,
  attestationRepository,
  organizationProfileRewardRepository,
  attestationStorage,
}) {
  const attestationData = await attestationRepository.getDataByKey({ key: attestationKey, attestationStorage });

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
