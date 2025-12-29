/**
 * @typedef {import('./Scopes.js').Scopes} Scopes
 */

import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { Scopes } from './Scopes.js';

export class Version {
  static #schema = Joi.object({
    id: Joi.number().required(),
    scope: Joi.string()
      .required()
      .valid(...Object.values(Scopes)),
    challengesConfiguration: Joi.object().instance(FlashAssessmentAlgorithmConfiguration).required(),
  });

  /**
   * @param {object} params
   * @param {number} params.id - version identifier
   * @param {Scopes} params.scope - Certification scope (CORE, DROIT, etc.)
   * @param {FlashAssessmentAlgorithmConfiguration} params.challengesConfiguration - Challenges configuration
   */
  constructor({ id, scope, challengesConfiguration }) {
    this.id = id;
    this.scope = scope;
    this.challengesConfiguration = challengesConfiguration;
    this.#validate();
  }

  #validate() {
    const { error } = Version.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
