export class CertificationFrameworksChallenge {
  /**
   * @param {Object} params
   * @param {ComplementaryCertificationKey} params.complementaryCertificationKey
   * @param {number} [params.discriminant]
   * @param {number} [params.difficulty]
   * @param {string} params.challengeId
   * @param {Date} params.createdAt
   */
  constructor({ createdAt, challengeId, discriminant, difficulty, complementaryCertificationKey }) {
    this.createdAt = createdAt;
    this.challengeId = challengeId;
    this.complementaryCertificationKey = complementaryCertificationKey;
    this.discriminant = discriminant;
    this.difficulty = difficulty;
  }

  calibrate({ discriminant, difficulty }) {
    this.discriminant = discriminant;
    this.difficulty = difficulty;
  }
}
