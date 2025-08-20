import { status as assessmentResultStatuses } from '../../../../shared/domain/models/AssessmentResult.js';
import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';
const STARTED = 'started';
const ENDED_BY_SUPERVISOR = 'endedBySupervisor';
const CORE_CERTIFICATION = 'CORE';
const DOUBLE_CORE_CLEA_CERTIFICATION = 'DOUBLE_CORE_CLEA';

class JuryCertificationSummary {
  constructor({
    id,
    firstName,
    lastName,
    status,
    pixScore,
    createdAt,
    completedAt,
    abortReason,
    isPublished,
    isEndedBySupervisor,
    complementaryCertificationLabelObtained,
    complementaryCertificationKeyObtained,
    certificationIssueReports,
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = _getStatus({ status, isEndedBySupervisor });
    this.pixScore = pixScore;
    this.isFlaggedAborted = Boolean(abortReason) && !completedAt;
    this.certificationObtained = _getCertificationObtained({
      complementaryCertificationLabelObtained,
      complementaryCertificationKeyObtained,
    });
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isPublished = isPublished;
    this.certificationIssueReports = certificationIssueReports;
  }

  isActionRequired() {
    return this.certificationIssueReports.some((issueReport) => issueReport.isImpactful && !issueReport.isResolved());
  }

  hasScoringError() {
    return this.status === JuryCertificationSummary.statuses.ERROR;
  }

  hasCompletedAssessment() {
    return this.status !== JuryCertificationSummary.statuses.STARTED;
  }

  getCertificationLabel(translate) {
    return this.#shouldBeTranslated() ? translate(this.#getKeyToTranslate()) : this.certificationObtained;
  }

  #getKeyToTranslate() {
    return `jury-certification-summary.comment.${this.certificationObtained}`;
  }

  #shouldBeTranslated() {
    return !!(
      this.certificationObtained === CORE_CERTIFICATION || this.certificationObtained === DOUBLE_CORE_CLEA_CERTIFICATION
    );
  }
}

function _getStatus({ status, isEndedBySupervisor }) {
  if (isEndedBySupervisor) {
    return ENDED_BY_SUPERVISOR;
  }

  if (!Object.values(assessmentResultStatuses).includes(status)) {
    return STARTED;
  }

  return status;
}

function _getCertificationObtained({ complementaryCertificationLabelObtained, complementaryCertificationKeyObtained }) {
  if (!complementaryCertificationLabelObtained) {
    return CORE_CERTIFICATION;
  }
  if (complementaryCertificationKeyObtained === ComplementaryCertificationKeys.CLEA) {
    return DOUBLE_CORE_CLEA_CERTIFICATION;
  }
  return complementaryCertificationLabelObtained;
}

const statuses = { ...assessmentResultStatuses, STARTED, ENDED_BY_SUPERVISOR };

JuryCertificationSummary.statuses = statuses;

export { CORE_CERTIFICATION, DOUBLE_CORE_CLEA_CERTIFICATION, JuryCertificationSummary, statuses };
