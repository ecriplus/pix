/**
 * @class AllowedCertificationCenterAccessDTO
 */
export class AllowedCertificationCenterAccessDTO {
  /**
   * @type {boolean}
   */
  isAccessBlockedUntilDate;

  /**
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
