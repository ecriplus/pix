class OrganizationProfileReward {
  constructor({ id, organizationId, profileRewardId, userId }) {
    this.id = id;
    this.profileRewardId = profileRewardId;
    this.organizationId = organizationId;
    this.userId = userId;
  }
}

export { OrganizationProfileReward };
