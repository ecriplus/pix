export class V3CertificationCourseDetailsForAdministration {
  constructor({
    certificationCourseId,
    certificationChallengesForAdministration = [],
    isRejectedForFraud,
    createdAt,
    completedAt,
    endedAt = null,
    assessmentState,
    assessmentResultStatus,
    abortReason,
    pixScore,
    reachedMeshIndex,
    numberOfChallenges,
    candidateSubscription,
  }) {
    this.certificationCourseId = certificationCourseId;
    this.isRejectedForFraud = isRejectedForFraud;
    this.certificationChallengesForAdministration = certificationChallengesForAdministration;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.assessmentState = assessmentState;
    this.assessmentResultStatus = assessmentResultStatus;
    this.abortReason = abortReason;
    this.pixScore = pixScore;
    this.reachedMeshIndex = reachedMeshIndex;
    this.numberOfChallenges = numberOfChallenges;
    this.endedAt = endedAt;
    this.candidateSubscription = candidateSubscription;
  }

  setCompetencesDetails(competenceList) {
    this.certificationChallengesForAdministration.forEach((challenge) => {
      challenge.setCompetenceDetails(competenceList);
    });
  }
}
