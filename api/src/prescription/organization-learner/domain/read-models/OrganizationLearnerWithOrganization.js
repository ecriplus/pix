export class OrganizationLearnerWithOrganization {
  id = null;
  organizationLearner = null;
  organization = null;
  constructor({ organizationLearner, organization }) {
    this.id = organizationLearner.id;
    this.organizationLearner = organizationLearner;
    this.organization = {
      id: organization.id,
      isManagingStudents: organization.isManagingStudents,
      tags: organization.tags.map((tag) => tag.name),
      type: organization.type,
    };
  }
}
