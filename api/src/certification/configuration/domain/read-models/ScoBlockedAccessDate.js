export class ScoBlockedAccessDate {
  /**
   * @param {Object} params
   * @param {String} params.scoOrganizationType
   * @param {Date} params.reopeningDate
   */
  constructor({ scoOrganizationType, reopeningDate }) {
    this.scoOrganizationType = scoOrganizationType;
    this.reopeningDate = reopeningDate;
  }
}
