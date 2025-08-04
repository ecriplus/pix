export class OrganizationLearnerWithParticipations {
  constructor({ organizationLearner, organization, campaignParticipations, tagNames }) {
    this.organizationLearner = {
      id: organizationLearner.id,
    };
    this.organization = {
      id: organization.id,
      isManagingStudents: organization.isManagingStudents,
      tags: tagNames,
      type: organization.type,
    };
    this.campaignParticipations = campaignParticipations.map(
      ({ id, targetProfileId, status, campaignName, campaignId }) => ({
        id,
        targetProfileId,
        status,
        campaignName,
        campaignId,
      }),
    );
  }
}
