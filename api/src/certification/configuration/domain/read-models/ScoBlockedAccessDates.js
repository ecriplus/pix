export class ScoBlockedAccessDates {
  /**
   * @param {Object} params
   * @param {Date} params.scoBlockedAccessDateLycee
   * @param {Date} params.scoBlockedAccessDateCollege
   */
  constructor({ scoBlockedAccessDateLycee, scoBlockedAccessDateCollege }) {
    this.scoBlockedAccessDateLycee = scoBlockedAccessDateLycee;
    this.scoBlockedAccessDateCollege = scoBlockedAccessDateCollege;
  }
}
