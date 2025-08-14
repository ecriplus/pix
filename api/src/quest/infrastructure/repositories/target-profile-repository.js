import { TargetProfile } from '../../domain/models/TargetProfile.js';

export const findByIds = async function ({ ids, targetProfilesApi }) {
  const targetProfiles = [];
  for (const targetProfileId of ids) {
    const targetProfile = await targetProfilesApi.getById(targetProfileId);
    targetProfiles.push(targetProfile);
  }
  return targetProfiles.map(toDomain);
};

const toDomain = (targetProfile) => new TargetProfile(targetProfile);
