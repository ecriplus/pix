export class OrganizationLearnerWithOrganization {
  id = null;
  organizationLearner = null;
  organization = null;

  constructor({ organizationLearner, organization }) {
    this.id = organizationLearner.id;
    this.organizationLearner = {
      id: organizationLearner.id,
    };
    this.organization = {
      id: organization.id,
      isManagingStudents: organization.isManagingStudents,
      tags: organization.tags,
      type: organization.type,
    };
  }
}
