import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { ABORT_REASONS } from '../../../shared/domain/constants/abort-reasons.js';

export const STATES = Assessment.states;
export const STATES_OF_LAST_QUESTION = Assessment.statesOfLastQuestion;
export class AssessmentSheet {
  constructor({
    certificationCourseId,
    userId,
    assessmentId,
    lastChallengeId,
    abortReason,
    isRejectedForFraud,
    state,
    lastQuestionState,
    updatedAt,
    lastQuestionDate,
    answers,
  }) {
    this.certificationCourseId = certificationCourseId;
    this.userId = userId;
    this.assessmentId = assessmentId;
    this.lastChallengeId = lastChallengeId;
    this.abortReason = abortReason;
    this.isRejectedForFraud = isRejectedForFraud;
    this.state = state;
    this.lastQuestionState = lastQuestionState;
    this.updatedAt = updatedAt;
    this.lastQuestionDate = lastQuestionDate;
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

  hasLastQuestionBeenFocusedOut() {
    return this.lastQuestionState === STATES_OF_LAST_QUESTION.FOCUSEDOUT;
  }
}
