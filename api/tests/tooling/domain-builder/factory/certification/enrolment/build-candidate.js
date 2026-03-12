import { Frameworks } from '../../../../../../src/certification/configuration/domain/models/Frameworks.js';
import { Candidate } from '../../../../../../src/certification/enrolment/domain/models/Candidate.js';
import { domainBuilder } from '../../../domain-builder.js';

const buildCandidate = function ({
  id = 123,
  createdAt = new Date(),
  firstName = 'Pat',
  lastName = 'Atrak',
  sex = 'F',
  birthCity = 'Nice',
  birthCountry = 'France',
  birthPostalCode = '06000',
  birthINSEECode = '06088',
  birthProvinceCode = '93',
  email = 'pat.atrak@example.com',
  resultRecipientEmail = 'otto.mate@example.com',
  birthdate = '1990-05-06',
  extraTimePercentage = 0.3,
  externalId = 'externalId',
  userId,
  reconciledAt,
  sessionId = 456,
  organizationLearnerId = null,
  authorizedToStart = false,
  billingMode = null,
  prepaymentCode = null,
  hasSeenCertificationInstructions = false,
  subscriptions = [],
  accessibilityAdjustmentNeeded,
  subscription = null,
} = {}) {
  return new Candidate({
    id,
    createdAt,
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    birthdate,
    extraTimePercentage,
    externalId,
    userId,
    reconciledAt,
    sessionId,
    organizationLearnerId,
    authorizedToStart,
    billingMode,
    prepaymentCode,
    hasSeenCertificationInstructions,
    subscriptions,
    accessibilityAdjustmentNeeded,
    subscription,
  });
};

buildCandidate.withCoreSubscription = function (args) {
  return buildCandidate({
    ...args,
    subscriptions: [domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId: null })],
    subscription: Frameworks.CORE,
  });
};

export { buildCandidate };
