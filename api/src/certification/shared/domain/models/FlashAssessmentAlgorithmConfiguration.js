import Joi from 'joi';

import { config } from '../../../../shared/config.js';
import { EntityValidationError } from '../../../../shared/domain/errors.js';

export class FlashAssessmentAlgorithmConfiguration {
  static #schema = Joi.object({
    maximumAssessmentLength: Joi.number().integer().min(0),
    challengesBetweenSameCompetence: Joi.number().integer().min(0).required(),
    limitToOneQuestionPerTube: Joi.boolean(),
    enablePassageByAllCompetences: Joi.boolean(),
    variationPercent: Joi.number().min(0).max(1),
  });

  /**
   * @param {Object} props
   * @param {number} [props.maximumAssessmentLength] - override the default limit for an assessment length
   * @param {number} [props.challengesBetweenSameCompetence] - define a number of questions before getting another one on the same competence
   * @param {boolean} [props.limitToOneQuestionPerTube] - limits questions to one per tube
   * @param {boolean} [props.enablePassageByAllCompetences] - enable or disable the passage through all competences
   * @param {number} props.variationPercent
   */
  constructor({
    maximumAssessmentLength = config.v3Certification.numberOfChallengesPerCourse,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube = false,
    enablePassageByAllCompetences = false,
    variationPercent,
  } = {}) {
    this.maximumAssessmentLength = maximumAssessmentLength;
    this.challengesBetweenSameCompetence = challengesBetweenSameCompetence;
    this.limitToOneQuestionPerTube = limitToOneQuestionPerTube;
    this.enablePassageByAllCompetences = enablePassageByAllCompetences;
    this.variationPercent = variationPercent;
    this.#validate();
  }

  #validate() {
    const { error } = FlashAssessmentAlgorithmConfiguration.#schema.validate(this, { allowUnknown: false });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }
}
