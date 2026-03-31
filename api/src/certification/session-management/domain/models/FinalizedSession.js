import { Frameworks } from '../../../shared/domain/models/Frameworks.js';

class FinalizedSession {
  constructor({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    isPublishable,
    publishedAt,
    assignedCertificationOfficerName,
  } = {}) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.certificationCenterName = certificationCenterName;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.isPublishable = isPublishable;
    this.publishedAt = publishedAt;
    this.assignedCertificationOfficerName = assignedCertificationOfficerName;
  }

  static from({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    hasExaminerGlobalComment,
    juryCertificationSummaries,
  }) {
    return new FinalizedSession({
      sessionId,
      finalizedAt,
      certificationCenterName,
      sessionDate,
      sessionTime,
      isPublishable:
        !hasExaminerGlobalComment &&
        _hasNoIssueReportsWithRequiredAction(juryCertificationSummaries) &&
        _hasNoScoringError(juryCertificationSummaries) &&
        _hasNoUnfinishedWithoutAbortReason(juryCertificationSummaries) &&
        _containsOnlyPublishableFrameworks(juryCertificationSummaries),
      publishedAt: null,
    });
  }

  publish(now) {
    this.publishedAt = now;
  }

  unpublish() {
    this.publishedAt = null;
  }

  assignCertificationOfficer({ certificationOfficerName }) {
    this.isPublishable = false;
    this.assignedCertificationOfficerName = certificationOfficerName;
  }
}

export { FinalizedSession };

function _hasNoIssueReportsWithRequiredAction(juryCertificationSummaries) {
  return !juryCertificationSummaries.some((summary) => summary.isActionRequired());
}

function _hasNoScoringError(juryCertificationSummaries) {
  return juryCertificationSummaries.every((summary) => !summary.hasScoringError());
}

function _hasNoUnfinishedWithoutAbortReason(juryCertificationSummaries) {
  return juryCertificationSummaries
    .filter((certificationSummary) => !certificationSummary.completedAt)
    .every((unfinishedCertificationSummary) => unfinishedCertificationSummary.isFlaggedAborted);
}

function _containsOnlyPublishableFrameworks(juryCertificationSummaries) {
  const publishableFrameworks = [
    Frameworks.CORE,
    Frameworks.CLEA,
    Frameworks.EDU_CPE,
    Frameworks.EDU_1ER_DEGRE,
    Frameworks.EDU_2ND_DEGRE,
  ];
  return juryCertificationSummaries.every(({ certificationFramework }) => {
    return publishableFrameworks.includes(certificationFramework);
  });
}
