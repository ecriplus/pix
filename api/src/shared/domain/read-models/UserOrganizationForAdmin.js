class UserOrganizationForAdmin {
  constructor({
    id,
    organizationRole,
    organizationId,
    organizationName,
    organizationType,
    organizationExternalId,
  } = {}) {
    this.id = id;
    this.organizationRole = organizationRole;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.organizationType = organizationType;
    this.organizationExternalId = organizationExternalId;
  }
}

export { UserOrganizationForAdmin };
