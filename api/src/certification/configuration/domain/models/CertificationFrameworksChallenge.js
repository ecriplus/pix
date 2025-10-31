import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';

export class CertificationFrameworksChallenge {
  static #schema = Joi.object({
    versionId: Joi.number().required(),
    challengeId: Joi.string().required(),
    discriminant: Joi.number().allow(null).optional(),
    difficulty: Joi.number().allow(null).optional(),
  });

  /**
   * @param {Object} params
   * @param {number} params.versionId
   * @param {string} params.challengeId
   * @param {number} [params.discriminant]
   * @param {number} [params.difficulty]
   */
  constructor({ versionId, challengeId, discriminant, difficulty }) {
    this.versionId = versionId;
    this.challengeId = challengeId;
    this.discriminant = discriminant;
    this.difficulty = difficulty;

    this.#validate();
  }

  calibrate({ discriminant, difficulty }) {
    this.discriminant = discriminant;
    this.difficulty = difficulty;
  }

  #validate() {
    const { error } = CertificationFrameworksChallenge.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
