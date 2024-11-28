import { config } from '../../../../shared/config.js';

/**
 * @param maximumAssessmentLength - override the default limit for an assessment length
 * @param challengesBetweenSameCompetence - define a number of questions before getting another one on the same competence
 * @param limitToOneQuestionPerTube - limits questions to one per tube
 * @param flashImplementation - the flash algorithm implementation
 * @param enablePassageByAllCompetences - enable or disable the passage through all competences
 * @param variationPercent - maximum variation of estimated level between two answers
 */
export class FlashAssessmentAlgorithmConfiguration {
  constructor({
    maximumAssessmentLength = config.v3Certification.numberOfChallengesPerCourse,
    challengesBetweenSameCompetence = config.v3Certification.challengesBetweenSameCompetence,
    limitToOneQuestionPerTube = false,
    enablePassageByAllCompetences = false,
    variationPercent,
    createdAt,
  } = {}) {
    this.maximumAssessmentLength = maximumAssessmentLength;
    this.challengesBetweenSameCompetence = challengesBetweenSameCompetence;
    this.limitToOneQuestionPerTube = limitToOneQuestionPerTube;
    this.enablePassageByAllCompetences = enablePassageByAllCompetences;
    this.variationPercent = variationPercent;
    this.createdAt = createdAt;
  }

  toDTO() {
    return {
      maximumAssessmentLength: this.maximumAssessmentLength,
      challengesBetweenSameCompetence: this.challengesBetweenSameCompetence,
      limitToOneQuestionPerTube: this.limitToOneQuestionPerTube,
      enablePassageByAllCompetences: this.enablePassageByAllCompetences,
      variationPercent: this.variationPercent,
      createdAt: this.createdAt,
    };
  }

  static fromDTO({
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
    createdAt,
  }) {
    return new FlashAssessmentAlgorithmConfiguration({
      maximumAssessmentLength,
      challengesBetweenSameCompetence,
      limitToOneQuestionPerTube,
      enablePassageByAllCompetences,
      variationPercent,
      createdAt,
    });
  }
}
