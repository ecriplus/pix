import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';

export class GlobalCertificationLevel {
  static #schema = Joi.object({ meshLevel: Joi.number().required() });

  /**
   * @param {Object} props
   * @param {number} props.meshLevel - interval index
   * @param {Object} props.translate - translation service
   */
  constructor({ meshLevel }) {
    this.meshLevel = meshLevel;
    this.#validate();
  }

  getLevelLabel(translate) {
    return translate(`certification.global.meshlevel.${this.meshLevel}`);
  }

  #validate() {
    const { error } = GlobalCertificationLevel.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
