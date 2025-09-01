import { config } from '../../../../shared/config.js';

export class FlashAssessmentAlgorithmConfiguration {
  /**
   * @param {Object} props
   * @param {number} [props.maximumAssessmentLength] - override the default limit for an assessment length
   * @param {number} [props.challengesBetweenSameCompetence] - define a number of questions before getting another one on the same competence
   * @param {boolean} [props.limitToOneQuestionPerTube] - limits questions to one per tube
   * @param {boolean} [props.enablePassageByAllCompetences] - enable or disable the passage through all competences
   * @param {number} [props.variationPercent] - maximum variation of estimated level between two answers
   */
  constructor({
    maximumAssessmentLength = config.v3Certification.numberOfChallengesPerCourse,
    challengesBetweenSameCompetence = config.v3Certification.challengesBetweenSameCompetence,
    limitToOneQuestionPerTube = false,
    enablePassageByAllCompetences = false,
    variationPercent,
  } = {}) {
    this.maximumAssessmentLength = maximumAssessmentLength;
    this.challengesBetweenSameCompetence = challengesBetweenSameCompetence;
    this.limitToOneQuestionPerTube = limitToOneQuestionPerTube;
    this.enablePassageByAllCompetences = enablePassageByAllCompetences;
    this.variationPercent = variationPercent;
  }
}
