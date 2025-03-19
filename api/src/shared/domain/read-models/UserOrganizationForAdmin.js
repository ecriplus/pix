class UserOrganizationForAdmin {
  constructor({
    id,
    organizationRole,
    organizationId,
    organizationName,
    organizationType,
    organizationExternalId,
    lastAccessedAt,
  } = {}) {
    this.id = id;
    this.organizationRole = organizationRole;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.organizationType = organizationType;
    this.organizationExternalId = organizationExternalId;
    this.lastAccessedAt = lastAccessedAt;
  }
}

export { UserOrganizationForAdmin };
