/**
 * @typedef {import ('../../../shared/domain/constants.js').SUBSCRIPTION_TYPES} SUBSCRIPTION_TYPES
 */

import { SUBSCRIPTION_TYPES } from '../../../shared/domain/constants.js';
import { validate } from '../../../shared/domain/validators/subscription-validator.js';

class Subscription {
  /**
   * @param {Object} params
   * @param {number} params.certificationCandidateId - identifier of the certification candidate
   * @param {SUBSCRIPTION_TYPES} params.type
   * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
   */
  constructor({ certificationCandidateId, type, complementaryCertificationKey }) {
    this.certificationCandidateId = certificationCandidateId;
    this.type = type;
    this.complementaryCertificationKey = complementaryCertificationKey;
    validate(this);
  }

  /**
   * @param {Object} params
   * @param {number} params.certificationCandidateId  - identifier of the certification candidate
   */
  static buildCore({ certificationCandidateId }) {
    return new Subscription({
      certificationCandidateId,
      type: SUBSCRIPTION_TYPES.CORE,
      complementaryCertificationKey: null,
    });
  }

  /**
   * @param {Object} params
   * @param {number} params.certificationCandidateId - identifier of the certification candidate
   * @param {string} params.complementaryCertificationKey
   */
  static buildComplementary({ certificationCandidateId, complementaryCertificationKey }) {
    return new Subscription({
      certificationCandidateId,
      type: SUBSCRIPTION_TYPES.COMPLEMENTARY,
      complementaryCertificationKey,
    });
  }

  isComplementary() {
    return this.type === SUBSCRIPTION_TYPES.COMPLEMENTARY;
  }

  isCore() {
    return this.type === SUBSCRIPTION_TYPES.CORE;
  }

  get id() {
    return `${this.certificationCandidateId}-${this.complementaryCertificationKey ?? SUBSCRIPTION_TYPES.CORE}`;
  }
}

export { Subscription };
