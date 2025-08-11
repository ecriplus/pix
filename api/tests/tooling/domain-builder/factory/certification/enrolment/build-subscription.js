import { Subscription } from '../../../../../../src/certification/enrolment/domain/models/Subscription.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';

const buildCoreSubscription = function ({ certificationCandidateId } = {}) {
  return Subscription.buildCore({ certificationCandidateId });
};

const buildComplementarySubscription = function ({
  certificationCandidateId,
  complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT,
} = {}) {
  return Subscription.buildComplementary({ certificationCandidateId, complementaryCertificationKey });
};

const buildSubscription = function ({
  certificationCandidateId,
  complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT,
  type,
} = {}) {
  return new Subscription({ certificationCandidateId, complementaryCertificationKey, type });
};

export { buildComplementarySubscription, buildCoreSubscription, buildSubscription };
