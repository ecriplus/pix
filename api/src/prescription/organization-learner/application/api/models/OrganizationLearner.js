export class OrganizationLearner {
  constructor({ id, firstName, lastName, userId, features, organizationId, ...attributes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.features = features;
    this.userId = userId;
    this.organizationId = organizationId;
    this.division = attributes['Libellé classe'];
  }
}
