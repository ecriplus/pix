import { SUBSCRIPTION_TYPES } from '../../../../shared/domain/constants.js';
import { ComplementaryCertificationKeys } from '../../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { Frameworks } from '../../../../shared/domain/models/Frameworks.js';
import { Candidate } from '../Candidate.js';

export class CandidateFactory {
  static fromSubscription({
    accessibilityAdjustmentNeeded,
    reconciledAt,
    subscriptionType,
    complementaryCertificationKey,
  } = {}) {
    let subscriptionScope;
    if (
      subscriptionType === SUBSCRIPTION_TYPES.CORE ||
      complementaryCertificationKey === ComplementaryCertificationKeys.CLEA
    ) {
      subscriptionScope = Frameworks.CORE;
    } else {
      subscriptionScope = complementaryCertificationKey;
    }

    return new Candidate({
      accessibilityAdjustmentNeeded,
      reconciledAt,
      subscriptionScope,
    });
  }
}
