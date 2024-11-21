export class ValidateCsvOrganizationImportFileJob {
  constructor({ organizationImportId, type, locale }) {
    this.organizationImportId = organizationImportId;
    this.type = type;
    this.locale = locale;
  }
}
