/**
 * @typedef {import('./ScoOrganizationTagName.js').ScoOrganizationTagName} ScoOrganizationTagName
 */

import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { ScoOrganizationTagName } from './ScoOrganizationTagName.js';

export class ScoBlockedAccessDate {
  static #schema = Joi.object({
    scoOrganizationTagName: Joi.string()
      .required()
      .valid(...Object.values(ScoOrganizationTagName)),
    reopeningDate: Joi.date().required(),
  });

  /**
   * @param {Object} params
   * @param {ScoOrganizationTagName} params.scoOrganizationTagName
   * @param {Date} params.reopeningDate
   */
  constructor({ scoOrganizationTagName, reopeningDate }) {
    this.scoOrganizationTagName = scoOrganizationTagName;
    this.reopeningDate = reopeningDate;
    this.#validate();
  }

  updateReopeningDate(reopeningDate) {
    this.reopeningDate = reopeningDate;
  }

  #validate() {
    const { error } = ScoBlockedAccessDate.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
