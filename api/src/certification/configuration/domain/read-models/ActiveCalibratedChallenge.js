export class ActiveCalibratedChallenge {
  /**
   * @param {Object} params
   * @param {ComplementaryCertificationKey} params.scope
   * @param {number} params.discriminant
   * @param {number} params.difficulty
   * @param {string} params.challengeId
   */
  constructor({ scope, discriminant, difficulty, challengeId }) {
    this.scope = scope;
    this.discriminant = discriminant;
    this.difficulty = difficulty;
    this.challengeId = challengeId;
  }
}
