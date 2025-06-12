export class OrganizationDTO {
  constructor({ id, name, type, logoUrl, isManagingStudents, identityProviderForCampaigns }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.logoUrl = logoUrl;
    this.isManagingStudents = isManagingStudents;
    this.identityProvider = identityProviderForCampaigns;
  }
}
