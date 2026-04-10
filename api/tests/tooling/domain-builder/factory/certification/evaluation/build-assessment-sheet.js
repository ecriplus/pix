import {
  AssessmentSheet,
  STATES,
} from '../../../../../../src/certification/evaluation/domain/models/AssessmentSheet.js';

export const buildAssessmentSheet = function ({
  certificationCourseId = 1,
  assessmentId = 2,
  userId = 3,
  lastChallengeId = null,
  abortReason = null,
  isRejectedForFraud = false,
  state = STATES.COMPLETED,
  updatedAt = new Date(),
  answers = [],
} = {}) {
  return new AssessmentSheet({
    certificationCourseId,
    assessmentId,
    userId,
    lastChallengeId,
    abortReason,
    isRejectedForFraud,
    state,
    updatedAt,
    answers,
  });
};

buildAssessmentSheet.STATES = STATES;
