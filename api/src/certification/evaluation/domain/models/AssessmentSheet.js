import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { ABORT_REASONS } from '../../../shared/domain/constants/abort-reasons.js';

export const STATES = Assessment.states;
export class AssessmentSheet {
  constructor({
    certificationCourseId,
    userId,
    assessmentId,
    lastChallengeId,
    abortReason,
    isRejectedForFraud,
    state,
    updatedAt,
    answers,
  }) {
    this.certificationCourseId = certificationCourseId;
    this.userId = userId;
    this.assessmentId = assessmentId;
    this.lastChallengeId = lastChallengeId;
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
    return this.state === STATES.STARTED;
  }

  complete() {
    if (this.state === STATES.STARTED) {
      this.state = STATES.COMPLETED;
      this.updatedAt = new Date();
    }
  }

  isEndedByInvigilator() {
    return this.state === STATES.ENDED_BY_INVIGILATOR;
  }

  hasBeenEndedDueToFinalization() {
    return this.state === STATES.ENDED_DUE_TO_FINALIZATION;
  }

  hasAnsweredChallenge(challengeId) {
    return this.answers.some((answer) => answer.challengeId === challengeId);
  }

  isChallengeExpectedToBeAnsweredNext(challengeId) {
    return Boolean(!this.lastChallengeId || this.lastChallengeId === challengeId);
  }
}
