import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { ABORT_REASONS } from '../../../shared/domain/constants/abort-reasons.js';

export class AssessmentSheet {
  constructor({
    certificationCourseId,
    userId,
    assessmentId,
    abortReason,
    isRejectedForFraud,
    state,
    updatedAt,
    answers,
  }) {
    this.certificationCourseId = certificationCourseId;
    this.userId = userId;
    this.assessmentId = assessmentId;
    this.abortReason = abortReason;
    this.isRejectedForFraud = isRejectedForFraud;
    this.state = state;
    this.updatedAt = updatedAt;
    this.answers = answers;
  }

  get isAbortReasonTechnical() {
    return this.abortReason === ABORT_REASONS.TECHNICAL;
  }

  get isStarted() {
    return this.state === Assessment.states.STARTED;
  }

  complete() {
    if (this.state === Assessment.states.STARTED) {
      this.state = Assessment.states.COMPLETED;
      this.updatedAt = new Date();
    }
  }
}
