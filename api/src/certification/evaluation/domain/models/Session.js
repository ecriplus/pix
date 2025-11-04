export class Session {
  /**
   * @params {number} id
   * @params {string} accessCode
   * @params {Date} finalizedAt
   * @params {Date} publishedAt
   */
  constructor({ id, accessCode, finalizedAt, publishedAt } = {}) {
    this.id = id;
    this.accessCode = accessCode;
    this.isNotAccessible = !!finalizedAt || !!publishedAt;
    this.isFinalized = Boolean(finalizedAt);
    this.isPublished = Boolean(publishedAt);
  }
}
