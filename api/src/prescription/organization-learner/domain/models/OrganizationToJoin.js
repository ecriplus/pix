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

  get hasReconciliationFields() {
    return Array.isArray(this.reconciliationFields) && this.reconciliationFields.length > 0;
  }

  get isReconciliationRequired() {
    return this.isRestricted && this.hasReconciliationFields;
  }
}
