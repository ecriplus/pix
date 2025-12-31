import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { status as assessmentResultStatuses } from '../../../../shared/domain/models/AssessmentResult.js';
import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';

const CORE_CERTIFICATION = 'CORE';
const DOUBLE_CORE_CLEA_CERTIFICATION = 'DOUBLE_CORE_CLEA';

export class JuryCertificationSummary {
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
    isEndedByInvigilator,
    complementaryCertificationLabelObtained,
    complementaryCertificationKeyObtained,
    certificationIssueReports,
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = _getStatus({ status, isEndedByInvigilator });
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
    return this.status === assessmentResultStatuses.ERROR;
  }

  hasCompletedAssessment() {
    return this.status !== Assessment.states.STARTED;
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

function _getStatus({ status, isEndedByInvigilator }) {
  if (isEndedByInvigilator) {
    return Assessment.states.ENDED_BY_INVIGILATOR;
  }

  if (!Object.values(assessmentResultStatuses).includes(status)) {
    return Assessment.states.STARTED;
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
