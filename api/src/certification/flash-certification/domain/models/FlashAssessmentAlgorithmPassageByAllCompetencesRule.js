import lodash from 'lodash';

export class FlashAssessmentAlgorithmPassageByAllCompetencesRule {
  static isApplicable({ enablePassageByAllCompetences }) {
    return enablePassageByAllCompetences;
  }

  static execute({ allChallenges, assessmentAnswers, availableChallenges }) {
    return this._filterAlreadyAnsweredCompetences({
      assessmentAnswers,
      availableChallenges,
      allChallenges,
    });
  }

  static _filterAlreadyAnsweredCompetences({ assessmentAnswers, allChallenges, availableChallenges }) {
    const answeredCompetenceIds = assessmentAnswers.map(
      ({ challengeId }) => lodash.find(allChallenges, { id: challengeId }).competenceId,
    );

    const remainingChallenges = allChallenges.filter(
      (challenge) => !answeredCompetenceIds.includes(challenge.competenceId),
    );

    if (remainingChallenges.length === 0) return availableChallenges;

    return remainingChallenges;
  }
}
