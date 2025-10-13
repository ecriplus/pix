import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { Frameworks } from '../../../shared/domain/models/Frameworks.js';

export class Candidate {
  static #schema = Joi.object({
    accessibilityAdjustmentNeeded: Joi.boolean().optional(),
    reconciledAt: Joi.date().required(),
    subscriptionScope: Joi.string()
      .valid(...Object.values(Frameworks))
      .required(),
  });

  /**
   * @param {Object} params
   * @param {Date} params.reconciledAt
   * @param {boolean} [params.accessibilityAdjustmentNeeded]
   * @param {Frameworks} params.subscriptionScope
   */
  constructor({ accessibilityAdjustmentNeeded, reconciledAt, subscriptionScope } = {}) {
    this.accessibilityAdjustmentNeeded = !!accessibilityAdjustmentNeeded;
    this.reconciledAt = reconciledAt;
    this.subscriptionScope = subscriptionScope;

    this.#validate();
  }

  #validate() {
    const { error } = Candidate.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
