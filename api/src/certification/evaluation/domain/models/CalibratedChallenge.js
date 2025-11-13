import { Accessibility } from '../../../../shared/domain/models/Challenge.js';
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
   */
  constructor({ id, discriminant, difficulty, blindnessCompatibility, colorBlindnessCompatibility } = {}) {
    this.id = id;
    this.discriminant = discriminant;
    this.difficulty = difficulty;
    this.blindnessCompatibility = blindnessCompatibility;
    this.colorBlindnessCompatibility = colorBlindnessCompatibility;
  }

  get isAccessible() {
    return (
      (this.blindnessCompatibility === Accessibility.OK || this.blindnessCompatibility === Accessibility.RAS) &&
      (this.colorBlindnessCompatibility === Accessibility.OK || this.colorBlindnessCompatibility === Accessibility.RAS)
    );
  }
}
