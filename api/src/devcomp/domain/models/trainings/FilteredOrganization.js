export class FilteredOrganization {
  constructor({ name, type, externalId, organizationId, targetProfileTrainingId, isExcluded = false }) {
    this.id = `${targetProfileTrainingId}-${organizationId}`;
    this.name = name;
    this.type = type;
    this.externalId = externalId;
    this.isExcluded = isExcluded;
    this.organizationId = organizationId;
  }
}
