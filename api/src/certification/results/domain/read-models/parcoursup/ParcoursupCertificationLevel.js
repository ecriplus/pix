/**
 * @typedef {import ('./MeshConfiguration.js').MeshConfiguration} MeshConfiguration
 */
import Joi from 'joi';

import { EntityValidationError } from '../../../../../shared/domain/errors.js';
import { findMeshFromScore } from '../../../../shared/domain/services/mesh-service.js';

/**
 * Temporary - To unify with CertificateMeshLevel
 */

export class ParcoursupCertificationLevel {
  static #schema = Joi.object({
    meshLevel: Joi.string().required(),
  });

  /**
   * @param {object} props
   * @param {number} props.score - certification score in Pix
   * @param {MeshConfiguration} props.[configuration] - certification score in Pix
   */
  constructor({ score, maxReachableLevel }) {
    this.meshLevel = findMeshFromScore({ score, maxReachableLevel }).key;
    this.#validate();
  }

  getLevelLabel(translate) {
    return this.#translate({ translate, key: `${this.meshLevel}.label` });
  }

  #translate({ translate, key }) {
    const translationKey = `certification.meshlevel.CORE.${key}`;
    const translation = translate(translationKey);
    if (translation === translationKey) {
      return '';
    }
    return translation;
  }

  #validate() {
    const { error } = ParcoursupCertificationLevel.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
