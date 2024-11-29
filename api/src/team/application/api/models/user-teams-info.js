/**
 * @class
 * @classdesc Model representing a user teams info.
 */
export class UserTeamsInfo {
  constructor({ isPixAgent, isOrganizationMember, isCertificationCenterMember } = {}) {
    this.isPixAgent = isPixAgent;
    this.isOrganizationMember = isOrganizationMember;
    this.isCertificationCenterMember = isCertificationCenterMember;
  }
}
