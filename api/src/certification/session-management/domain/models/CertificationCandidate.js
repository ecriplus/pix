class CertificationCandidate {
  /**
   * @param {object} param
   * @param {number} param.userId
   * @param {Date} param.reconciledAt
   */
  constructor({ userId, reconciledAt } = {}) {
    this.userId = userId;
    this.reconciledAt = reconciledAt;
  }
}

export { CertificationCandidate };
