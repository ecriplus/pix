import { Candidate } from '../../../../../../src/certification/evaluation/domain/models/Candidate.js';
import { Scopes } from '../../../../../../src/certification/shared/domain/models/Scopes.js';

export const buildEvaluationCandidate = function ({
  accessibilityAdjustmentNeeded,
  reconciledAt = new Date('2024-10-18'),
  subscriptionScope = Scopes.CORE,
} = {}) {
  return new Candidate({
    accessibilityAdjustmentNeeded,
    reconciledAt,
    subscriptionScope,
  });
};
