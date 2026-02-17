import { AssessmentSheet } from '../../../../../../src/certification/evaluation/domain/models/AssessmentSheet.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';

export const buildAssessmentSheet = function ({
  certificationCourseId = 1,
  assessmentId = 2,
  abortReason = null,
  maxReachableLevelOnCertificationDate = 5,
  isRejectedForFraud = false,
  state = Assessment.states.COMPLETED,
  updatedAt = new Date(),
  answers = [],
} = {}) {
  return new AssessmentSheet({
    certificationCourseId,
    assessmentId,
    abortReason,
    maxReachableLevelOnCertificationDate,
    isRejectedForFraud,
    state,
    updatedAt,
    answers,
  });
};
