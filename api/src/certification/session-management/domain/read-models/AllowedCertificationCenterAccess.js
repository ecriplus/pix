/**
 * @class AllowedCertificationCenterAccess
 */
export class AllowedCertificationCenterAccess {
  /**
   * @type {boolean}
   */
  isAccessBlockedUntilDate;

  /**
   * The date until which access to the certification center is blocked
   * @type {string|null}
   */
  pixCertifBlockedAccessUntilDate;

  /**
   * @param {Object} params
   * @param {boolean} params.isAccessBlockedUntilDate
   * @param {string|null} params.pixCertifBlockedAccessUntilDate
   */
  constructor({ isAccessBlockedUntilDate, pixCertifBlockedAccessUntilDate }) {
    this.isAccessBlockedUntilDate = !!isAccessBlockedUntilDate;
    this.pixCertifBlockedAccessUntilDate = pixCertifBlockedAccessUntilDate;
  }
}
