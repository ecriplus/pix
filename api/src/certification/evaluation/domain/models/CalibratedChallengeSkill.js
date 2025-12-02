export class CalibratedChallengeSkill {
  /*
   * @param id
   * @param {string} name
   * @param {string} competenceId
   * @param {string} tubeId
   */
  constructor({ id, name, competenceId, tubeId }) {
    this.id = id;
    this.name = name;
    this.competenceId = competenceId;
    this.tubeId = tubeId;
  }
}
