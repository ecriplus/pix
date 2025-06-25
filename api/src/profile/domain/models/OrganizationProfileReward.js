class OrganizationProfileReward {
  constructor({ organizationId, profileRewardId, userId }) {
    this.profileRewardId = profileRewardId;
    this.organizationId = organizationId;
    this.userId = userId;
  }
}

export { OrganizationProfileReward };
