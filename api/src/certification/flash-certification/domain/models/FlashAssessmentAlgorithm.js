import { config } from '../../../../shared/config.js';
import { FlashAssessmentAlgorithmChallengesBetweenCompetencesRule } from './FlashAssessmentAlgorithmChallengesBetweenCompetencesRule.js';
import { FlashAssessmentAlgorithmNonAnsweredSkillsRule } from './FlashAssessmentAlgorithmNonAnsweredSkillsRule.js';
import { FlashAssessmentAlgorithmOneQuestionPerTubeRule } from './FlashAssessmentAlgorithmOneQuestionPerTubeRule.js';
import { FlashAssessmentAlgorithmPassageByAllCompetencesRule } from './FlashAssessmentAlgorithmPassageByAllCompetencesRule.js';
import { FlashAssessmentAlgorithmRuleEngine } from './FlashAssessmentAlgorithmRuleEngine.js';

const availableRules = [
  FlashAssessmentAlgorithmOneQuestionPerTubeRule,
  FlashAssessmentAlgorithmNonAnsweredSkillsRule,
  FlashAssessmentAlgorithmPassageByAllCompetencesRule,
  FlashAssessmentAlgorithmChallengesBetweenCompetencesRule,
];

class FlashAssessmentAlgorithm {
  /**
   * Model to interact with the flash algorithm
   * @param configuration - options to configure algorithm challenge selection and behaviour
   */
  constructor({ flashAlgorithmImplementation, configuration = {} } = {}) {
    this._configuration = configuration;
    this.flashAlgorithmImplementation = flashAlgorithmImplementation;

    this.ruleEngine = new FlashAssessmentAlgorithmRuleEngine(availableRules, {
      limitToOneQuestionPerTube: configuration.limitToOneQuestionPerTube,
      challengesBetweenSameCompetence: configuration.challengesBetweenSameCompetence,
      enablePassageByAllCompetences: configuration.enablePassageByAllCompetences,
    });
  }

  getPossibleNextChallenges({
    assessmentAnswers,
    challenges,
    initialCapacity = config.v3Certification.defaultCandidateCapacity,
  }) {
    const maximumAssessmentLength = this._configuration.maximumAssessmentLength;
    if (assessmentAnswers?.length > maximumAssessmentLength) {
      throw new RangeError('User answered more questions than allowed');
    }

    if (this.#hasAnsweredToAllChallenges({ assessmentAnswers, maximumAssessmentLength })) {
      return [];
    }

    const { capacity } = this.getCapacityAndErrorRate({
      allAnswers: assessmentAnswers,
      challenges,
      initialCapacity,
    });

    const challengesAfterRulesApplication = this.#applyChallengeSelectionRules(assessmentAnswers, challenges);

    if (challengesAfterRulesApplication?.length === 0) {
      throw new RangeError('No eligible challenges in referential');
    }

    return this.flashAlgorithmImplementation.getPossibleNextChallenges({
      availableChallenges: challengesAfterRulesApplication,
      capacity,
    });
  }

  #hasAnsweredToAllChallenges({ assessmentAnswers, maximumAssessmentLength }) {
    if (assessmentAnswers && assessmentAnswers.length === maximumAssessmentLength) {
      return true;
    }

    return false;
  }

  #applyChallengeSelectionRules(assessmentAnswers, challenges) {
    return this.ruleEngine.execute({
      assessmentAnswers,
      allChallenges: challenges,
    });
  }

  getCapacityAndErrorRate({
    allAnswers,
    challenges,
    initialCapacity = config.v3Certification.defaultCandidateCapacity,
  }) {
    return this.flashAlgorithmImplementation.getCapacityAndErrorRate({
      allAnswers,
      challenges,
      capacity: initialCapacity,
      variationPercent: this._configuration.variationPercent,
    });
  }

  getCapacityAndErrorRateHistory({
    allAnswers,
    challenges,
    initialCapacity = config.v3Certification.defaultCandidateCapacity,
  }) {
    return this.flashAlgorithmImplementation.getCapacityAndErrorRateHistory({
      allAnswers,
      challenges,
      capacity: initialCapacity,
      variationPercent: this._configuration.variationPercent,
    });
  }

  getReward({ capacity, discriminant, difficulty }) {
    return this.flashAlgorithmImplementation.getReward({ capacity, discriminant, difficulty });
  }

  getConfiguration() {
    return this._configuration;
  }
}

export { FlashAssessmentAlgorithm };
