/**
 * @typedef {import ('../../../results/domain/models/v3/MeshConfiguration.js').MeshConfiguration} MeshConfiguration
 */
import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { meshConfiguration } from '../../../results/domain/models/v3/MeshConfiguration.js';

export class GlobalCertificationLevel {
  static #schema = Joi.object({
    meshLevel: Joi.number().required(),
  });

  /**
   * @param {Object} props
   * @param {number} props.score - certification score in Pix
   * @param {MeshConfiguration} props.[configuration] - certification score in Pix
   */
  constructor({ score, configuration = meshConfiguration }) {
    this.meshLevel = configuration.findIntervalIndexFromScore({ score });
    this.#validate();
  }

  getLevelLabel(translate) {
    const translationKey = `certification.global.meshlevel.${this.meshLevel}`;
    const translation = translate(translationKey);
    if (translation === translationKey) {
      return '';
    }
    return translation;
  }

  #validate() {
    const { error } = GlobalCertificationLevel.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
