/**
 * Traduction: Acquis d'épreuve calibrée
 */
export class CalibratedChallengeSkill {
  /**
   * Constructeur d'acquis d'épreuve calibré
   *
   * @param id
   * @param name
   * @param competenceId
   * @param tubeId
   */
  constructor({ id, name, competenceId, tubeId }) {
    this.id = id;
    this.name = name;
    this.competenceId = competenceId;
    this.tubeId = tubeId;
  }
}
