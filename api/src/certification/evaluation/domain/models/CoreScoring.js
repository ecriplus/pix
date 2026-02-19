import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { AssessmentResult } from '../../../../shared/domain/models/AssessmentResult.js';

export class CoreScoring {
  static #schema = Joi.object({
    assessmentResult: Joi.object().instance(AssessmentResult).required(),
  });

  constructor({ competenceMarks, assessmentResult }) {
    this.competenceMarks = competenceMarks;
    this.assessmentResult = assessmentResult;
    //this.#validate(); todo le remettre après
  }

  #validate() {
    const { error } = CoreScoring.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
