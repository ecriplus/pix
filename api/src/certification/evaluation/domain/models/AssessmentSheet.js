/**
 * @typedef {import('../../../../evaluation/domain/models/Answer.js')} Answer
 */

import Joi from 'joi';

import { Answer } from '../../../../evaluation/domain/models/Answer.js';
import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { ABORT_REASONS } from '../../../shared/domain/constants/abort-reasons.js';

export class AssessmentSheet {
  /**
   * @param {object} params
   * @param {number} params.certificationCourseId
   * @param {number} params.assessmentId
   * @param {ABORT_REASONS} params.abortReason
   * @param {boolean} params.isRejectedForFraud
   * @param {Assessment.states} params.state
   * @param {Date} params.updatedAt
   * @param {Answer[]} params.answers
   */
  static #schema = Joi.object({
    certificationCourseId: Joi.number().required(),
    assessmentId: Joi.number().required(),
    abortReason: Joi.string()
      .valid(...Object.values(ABORT_REASONS))
      .allow(null),
    isRejectedForFraud: Joi.boolean().required(),
    state: Joi.string()
      .valid(...Object.values(Assessment.states))
      .required(),
    updatedAt: Joi.date().optional(),
    answers: Joi.array().items(Joi.object().instance(Answer)).required(),
  });

  constructor({ certificationCourseId, assessmentId, abortReason, isRejectedForFraud, state, updatedAt, answers }) {
    this.certificationCourseId = certificationCourseId;
    this.assessmentId = assessmentId;
    this.abortReason = abortReason;
    this.isRejectedForFraud = isRejectedForFraud;
    this.state = state;
    this.updatedAt = updatedAt;
    this.answers = answers;
    this.#validate();
  }

  #validate() {
    const { error } = AssessmentSheet.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }

  get isAbortReasonTechnical() {
    return this.abortReason === ABORT_REASONS.TECHNICAL;
  }

  get isStarted() {
    return this.state === Assessment.states.STARTED;
  }

  complete() {
    if (this.state === Assessment.states.STARTED) {
      this.state = Assessment.states.COMPLETED;
      this.updatedAt = new Date();
    }
  }
}
