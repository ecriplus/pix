import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { ABORT_REASONS } from '../../../shared/domain/constants/abort-reasons.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';

export class CertificationCourse {
  constructor({
    id,
    version,
    updatedAt,
    endedAt,
    abortReason,
    assessmentId,
    assessmentState,
    assessmentLatestActivityAt,
  }) {
    this.id = id;
    this.version = version;
    this.updatedAt = updatedAt;
    this.endedAt = endedAt;
    this.abortReason = abortReason;
    this.assessmentId = assessmentId;
    this.assessmentState = assessmentState;
    this.assessmentLatestActivityAt = assessmentLatestActivityAt;
  }

  finalize({ finalizedAt, certificationReport }) {
    this.updatedAt = finalizedAt;
    if (certificationReport.abortReason && this.assessmentState === Assessment.states.COMPLETED) {
      this.abortReason = null;
    }
  }

  get isV2() {
    return AlgorithmEngineVersion.isV2(this.version);
  }

  get isV3() {
    return AlgorithmEngineVersion.isV3(this.version);
  }

  get isCompleted() {
    return this.assessmentState === Assessment.states.COMPLETED;
  }

  get isAbortReasonCandidateRelated() {
    return this.abortReason === ABORT_REASONS.CANDIDATE;
  }

  get isAbortReasonTechnical() {
    return this.abortReason === ABORT_REASONS.TECHNICAL;
  }

  endDueToFinalization() {
    if (this.assessmentState === Assessment.states.STARTED) {
      this.assessmentState = Assessment.states.ENDED_DUE_TO_FINALIZATION;
      this.endedAt = this.assessmentLatestActivityAt;
      this.updatedAt = new Date();
    }
  }
}
