import lodash from 'lodash';

export class FlashAssessmentAlgorithmForcedCompetencesRule {
  static isApplicable({ forcedCompetences }) {
    return forcedCompetences.length > 0;
  }

  static execute({ allChallenges, assessmentAnswers, availableChallenges, forcedCompetences }) {
    return this._filterAlreadyAnsweredCompetences({
      assessmentAnswers,
      availableChallenges,
      allChallenges,
      forcedCompetences,
    });
  }

  static _filterAlreadyAnsweredCompetences({
    assessmentAnswers,
    allChallenges,
    forcedCompetences,
    availableChallenges,
  }) {
    const answeredCompetenceIds = assessmentAnswers.map(
      ({ challengeId }) => lodash.find(allChallenges, { id: challengeId }).competenceId,
    );

    const remainingCompetenceIds = forcedCompetences.filter(
      (competenceId) => !answeredCompetenceIds.includes(competenceId),
    );

    const allCompetencesAreAnswered = remainingCompetenceIds.length === 0;

    if (allCompetencesAreAnswered) {
      return availableChallenges;
    }
    return availableChallenges.filter(({ competenceId }) => remainingCompetenceIds.includes(competenceId));
  }
}
