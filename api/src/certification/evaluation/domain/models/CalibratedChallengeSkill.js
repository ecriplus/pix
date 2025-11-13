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
   */
  constructor({ id, name, competenceId } = {}) {
    this.id = id;
    this.name = name;
    this.competenceId = competenceId;
  }
}
