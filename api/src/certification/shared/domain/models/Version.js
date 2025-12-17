/**
 * @typedef {import('./Scopes.js').Scopes} Scopes
 */

import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { Scopes } from './Scopes.js';

export class Version {
  static #schema = Joi.object({
    id: Joi.number().required(),
    scope: Joi.string()
      .required()
      .valid(...Object.values(Scopes)),
    challengesConfiguration: Joi.object()
      .keys({
        defaultCandidateCapacity: Joi.number().required(),
      })
      .unknown(true)
      .required(),
  });

  /**
   * @param {Object} params
   * @param {number} params.id - version identifier
   * @param {Scopes} params.scope - Certification scope (CORE, DROIT, etc.)
   * @param {Object} params.challengesConfiguration - Challenges configuration
   * @param {number} params.challengesConfiguration.defaultCandidateCapacity - capacity when none has been yet determined
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
