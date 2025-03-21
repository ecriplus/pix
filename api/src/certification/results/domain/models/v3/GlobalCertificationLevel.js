/**
 * @typedef {import ('./MeshConfiguration.js').MeshConfiguration} MeshConfiguration
 */
import Joi from 'joi';

import { EntityValidationError } from '../../../../../shared/domain/errors.js';
import { meshConfiguration } from './MeshConfiguration.js';

export class GlobalCertificationLevel {
  static #schema = Joi.object({
    meshLevel: Joi.string().required(),
  });

  /**
   * @param {Object} props
   * @param {number} props.score - certification score in Pix
   * @param {MeshConfiguration} props.[configuration] - certification score in Pix
   */
  constructor({ score, configuration = meshConfiguration }) {
    this.meshLevel = configuration.findMeshFromScore({ score }).key;
    this.#validate();
  }

  getLevelLabel(translate) {
    return this.#translate({ translate, key: `${this.meshLevel}.label` });
  }

  getSummaryLabel(translate) {
    return this.#translate({ translate, key: `${this.meshLevel}.summary` });
  }

  getDescriptionLabel(translate) {
    return this.#translate({ translate, key: `${this.meshLevel}.description` });
  }

  #translate({ translate, key }) {
    const translationKey = `certification.global.meshlevel.${key}`;
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
