import { Candidate } from '../../../../../../src/certification/evaluation/domain/models/Candidate.js';
import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';

export const buildEvaluationCandidate = function ({
  accessibilityAdjustmentNeeded,
  reconciledAt = new Date('2024-10-18'),
  subscriptionScope = Frameworks.CORE,
} = {}) {
  return new Candidate({
    accessibilityAdjustmentNeeded,
    reconciledAt,
    subscriptionScope,
  });
};
