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
}
