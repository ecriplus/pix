export class CombinedCourseParticipationDetails {
  constructor({
    id,
    firstName,
    lastName,
    status,
    updatedAt,
    createdAt,
    nbModules,
    nbCampaigns,
    nbModulesCompleted,
    nbCampaignsCompleted,
    hasFormationItem,
  }) {
    this.id = id;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.firstName = firstName;
    this.lastName = lastName;
    this.hasFormationItem = hasFormationItem;
    this.nbModules = nbModules;
    this.nbCampaigns = nbCampaigns;
    this.nbCampaignsCompleted = nbCampaignsCompleted;
    this.nbModulesCompleted = nbModulesCompleted;
  }
}
