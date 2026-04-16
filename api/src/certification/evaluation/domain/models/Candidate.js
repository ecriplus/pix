import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { Frameworks } from '../../../shared/domain/models/Frameworks.js';

export class Candidate {
  static #schema = Joi.object({
    accessibilityAdjustmentNeeded: Joi.boolean().optional(),
    reconciledAt: Joi.date().required(),
    subscriptionFramework: Joi.string()
      .valid(...Object.values(Frameworks))
      .required(),
  });

  /**
   * @param {object} params
   * @param {Date} params.reconciledAt
   * @param {boolean} [params.accessibilityAdjustmentNeeded]
   * @param {Frameworks} params.subscriptionFramework
   */
  constructor({ accessibilityAdjustmentNeeded, reconciledAt, subscriptionFramework }) {
    this.accessibilityAdjustmentNeeded = !!accessibilityAdjustmentNeeded;
    this.reconciledAt = reconciledAt;
    this.subscriptionFramework = subscriptionFramework;

    this.#validate();
  }

  #validate() {
    const { error } = Candidate.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
