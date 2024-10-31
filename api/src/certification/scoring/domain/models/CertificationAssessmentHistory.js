import { CertificationChallengeCapacity } from './CertificationChallengeCapacity.js';

export class CertificationAssessmentHistory {
  constructor({ capacityHistory }) {
    this.capacityHistory = capacityHistory;
  }
  // WARN: challenges are not Array<Challenge> but Array<CertificationChallengeForScoring>
  static fromChallengesAndAnswers({ algorithm, challenges, allAnswers }) {
    const capacityAndErrorRateHistory = algorithm.getCapacityAndErrorRateHistory({
      allAnswers,
      challenges,
    });

    const capacityHistory = capacityAndErrorRateHistory.map(({ answerId, capacity }, index) =>
      CertificationChallengeCapacity.create({
        answerId,
        certificationChallengeId: challenges[index].certificationChallengeId,
        capacity,
      }),
    );

    return new CertificationAssessmentHistory({
      capacityHistory,
    });
  }
}
