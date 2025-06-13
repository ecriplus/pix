export class OrganizationToJoin {
  constructor({ id, name, type, logoUrl, isManagingStudents, identityProvider, organizationLearnerImportFormat } = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.logoUrl = logoUrl;
    this.identityProvider = identityProvider;

    this.isRestricted = organizationLearnerImportFormat != undefined || isManagingStudents;
    this.reconciliationFields = organizationLearnerImportFormat?.reconciliationFields;
  }
}
