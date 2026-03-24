/**
 * @typedef {import ('./MeshConfiguration.js').MeshConfiguration} MeshConfiguration
 */
import Joi from 'joi';

import { EntityValidationError } from '../../../../../shared/domain/errors.js';
import { Frameworks } from '../../../../configuration/domain/models/Frameworks.js';

export const CORE_LEVELS = {
  0: 'LEVEL_PRE_BEGINNER',
  1: 'LEVEL_BEGINNER_1',
  2: 'LEVEL_BEGINNER_2',
  3: 'LEVEL_INDEPENDENT_3',
  4: 'LEVEL_INDEPENDENT_4',
  5: 'LEVEL_ADVANCED_5',
  6: 'LEVEL_ADVANCED_6',
  7: 'LEVEL_EXPERT_7',
  8: 'LEVEL_EXPERT_8',
};

export const EDU_LEVELS = {
  0: 'LEVEL_ADMISSIBLE',
};

export class GlobalCertificationLevel {
  static #schema = Joi.object({
    meshLevel: Joi.string().allow(null),
  });

  /**
   * @param {object} props
   * @param {number} props.reachedMeshIndex
   * @param {string} props.certificationFramework
   */
  constructor({ reachedMeshIndex, certificationFramework }) {
    this.meshLevel = this.#getLevelKey({ reachedMeshIndex, certificationFramework });
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

  #getLevelKey({ reachedMeshIndex, certificationFramework }) {
    switch (certificationFramework) {
      case Frameworks.CORE:
      case Frameworks.CLEA:
        return CORE_LEVELS[reachedMeshIndex];
      case Frameworks.EDU_1ER_DEGRE:
      case Frameworks.EDU_2ND_DEGRE:
      case Frameworks.EDU_CPE:
        if (reachedMeshIndex === null) {
          return null;
        }
        return EDU_LEVELS[0];
    }
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
