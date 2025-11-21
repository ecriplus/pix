export class AnsweredChallenge {
  /**
   * @param {string} id
   * @param {AnsweredChallengeSkill} skill
   */
  constructor({ id, skill }) {
    this.id = id;
    this.skill = skill;
  }
}
