export class CertificationFrameworksChallenge {
  /**
   * @param {Object} params
   * @param {number} [params.discriminant]
   * @param {number} [params.difficulty]
   * @param {string} params.challengeId
   */
  constructor({ challengeId, discriminant, difficulty }) {
    this.challengeId = challengeId;
    this.discriminant = discriminant;
    this.difficulty = difficulty;
  }

  calibrate({ discriminant, difficulty }) {
    this.discriminant = discriminant;
    this.difficulty = difficulty;
  }
}
