export const Accessibility = Object.freeze({
  RAS: 'RAS',
  OK: 'OK',
});

/**
 * Traduction: Épreuve calibrée
 */
export class CalibratedChallenge {
  /**
   * Constructeur d'épreuve calibrée
   *
   * @param id
   * @param discriminant
   * @param difficulty
   * @param blindnessCompatibility
   * @param colorBlindnessCompatibility
   * @param skill
   */
  constructor({ id, discriminant, difficulty, blindnessCompatibility, colorBlindnessCompatibility, skill }) {
    this.id = id;
    this.discriminant = discriminant;
    this.difficulty = difficulty;
    this.blindnessCompatibility = blindnessCompatibility;
    this.colorBlindnessCompatibility = colorBlindnessCompatibility;
    this.skill = skill;
  }

  get isAccessible() {
    return (
      (this.blindnessCompatibility === Accessibility.OK || this.blindnessCompatibility === Accessibility.RAS) &&
      (this.colorBlindnessCompatibility === Accessibility.OK || this.colorBlindnessCompatibility === Accessibility.RAS)
    );
  }
}
