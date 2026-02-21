import { ABORT_REASONS } from '../../../shared/domain/constants/abort-reasons.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';

export class CertificationCourse {
  constructor({ id, version, updatedAt, completedAt, abortReason, assessmentState }) {
    this.id = id;
    this.version = version;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
    this.abortReason = abortReason;
    this.assessmentState = assessmentState;
  }

  finalize({ finalizedAt, certificationReport }) {
    this.updatedAt = finalizedAt;
    if (certificationReport.abortReason && this.completedAt) {
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
    return !!this.completedAt;
  }

  get isAbortReasonCandidateRelated() {
    return this.abortReason === ABORT_REASONS.CANDIDATE;
  }

  get isAbortReasonTechnical() {
    return this.abortReason === ABORT_REASONS.TECHNICAL;
  }
}
