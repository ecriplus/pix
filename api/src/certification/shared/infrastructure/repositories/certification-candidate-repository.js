import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Subscription } from '../../../enrolment/domain/models/Subscription.js';
import { CertificationCandidate } from '../../domain/models/CertificationCandidate.js';
import { ComplementaryCertification } from '../../domain/models/ComplementaryCertification.js';

/**
 * @param {object} params
 * @param {number} params.sessionId
 * @param {number} params.userId
 * @returns {Promise<CertificationCandidate | undefined>}
 */
const getBySessionIdAndUserId = async function ({ sessionId, userId }) {
  const candidateWithSubscriptionsData = await candidateWithSubscriptionsBaseQuery().where({ sessionId, userId });
  if (candidateWithSubscriptionsData.length === 0) {
    return undefined;
  }
  return toDomain(candidateWithSubscriptionsData);
};

const findBySessionId = async function (sessionId) {
  const candidatesWithSubscriptionsData = await candidateWithSubscriptionsBaseQuery()
    .where({ 'certification-candidates.sessionId': sessionId })
    .orderByRaw('LOWER("certification-candidates"."lastName") asc')
    .orderByRaw('LOWER("certification-candidates"."firstName") asc');

  if (candidatesWithSubscriptionsData.length === 0) {
    return [];
  }

  const candidatesDataByCandidate = new Map();

  for (const candidateWithSubscriptionsData of candidatesWithSubscriptionsData) {
    if (!candidatesDataByCandidate.has(candidateWithSubscriptionsData.id)) {
      candidatesDataByCandidate.set(candidateWithSubscriptionsData.id, []);
    }
    candidatesDataByCandidate.get(candidateWithSubscriptionsData.id).push(candidateWithSubscriptionsData);
  }

  return Array.from(candidatesDataByCandidate.values(), toDomain);
};

const update = async function (certificationCandidate) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn('certification-candidates')
    .where({ id: certificationCandidate.id })
    .update({ authorizedToStart: certificationCandidate.authorizedToStart });

  if (result === 0) {
    throw new NotFoundError('Aucun candidat trouvé');
  }
};

const getWithComplementaryCertification = async function ({ id }) {
  const candidateWithSubscriptionsData = await candidateWithSubscriptionsBaseQuery().where(
    'certification-candidates.id',
    id,
  );
  if (candidateWithSubscriptionsData.length === 0) {
    throw new NotFoundError('Candidate not found');
  }
  return toDomain(candidateWithSubscriptionsData);
};

export { findBySessionId, getBySessionIdAndUserId, getWithComplementaryCertification, update };

function toDomain(candidateWithSubscriptionsData) {
  const subscriptions = [];
  let complementaryCertification = null;
  for (const candidateSubscriptionData of candidateWithSubscriptionsData) {
    const subscription = new Subscription({
      certificationCandidateId: candidateSubscriptionData.id,
      type: candidateSubscriptionData.subscriptionType,
      complementaryCertificationKey: candidateSubscriptionData.complementaryCertificationKey,
    });
    subscriptions.push(subscription);
    if (subscription.complementaryCertificationKey) {
      complementaryCertification = new ComplementaryCertification({
        id: candidateSubscriptionData.complementaryCertificationId,
        key: candidateSubscriptionData.complementaryCertificationKey,
        label: candidateSubscriptionData.complementaryCertificationLabel,
      });
    }
  }

  return new CertificationCandidate({
    ...candidateWithSubscriptionsData[0],
    subscriptions,
    complementaryCertification,
  });
}

function candidateWithSubscriptionsBaseQuery() {
  const knexConn = DomainTransaction.getConnection();
  return knexConn
    .select({
      id: 'certification-candidates.id',
      firstName: 'certification-candidates.firstName',
      lastName: 'certification-candidates.lastName',
      sex: 'certification-candidates.sex',
      birthPostalCode: 'certification-candidates.birthPostalCode',
      birthINSEECode: 'certification-candidates.birthINSEECode',
      birthCity: 'certification-candidates.birthCity',
      birthProvinceCode: 'certification-candidates.birthProvinceCode',
      birthCountry: 'certification-candidates.birthCountry',
      email: 'certification-candidates.email',
      resultRecipientEmail: 'certification-candidates.resultRecipientEmail',
      externalId: 'certification-candidates.externalId',
      birthdate: 'certification-candidates.birthdate',
      extraTimePercentage: 'certification-candidates.extraTimePercentage',
      createdAt: 'certification-candidates.createdAt',
      authorizedToStart: 'certification-candidates.authorizedToStart',
      sessionId: 'certification-candidates.sessionId',
      userId: 'certification-candidates.userId',
      organizationLearnerId: 'certification-candidates.organizationLearnerId',
      billingMode: 'certification-candidates.billingMode',
      prepaymentCode: 'certification-candidates.prepaymentCode',
      hasSeenCertificationInstructions: 'certification-candidates.hasSeenCertificationInstructions',
      accessibilityAdjustmentNeeded: 'certification-candidates.accessibilityAdjustmentNeeded',
      reconciledAt: 'certification-candidates.reconciledAt',
      complementaryCertificationId: 'complementary-certifications.id',
      complementaryCertificationLabel: 'complementary-certifications.label',
      complementaryCertificationKey: 'complementary-certifications.key',
      subscriptionType: 'certification-subscriptions.type',
    })
    .from('certification-candidates')
    .join(
      'certification-subscriptions',
      'certification-candidates.id',
      'certification-subscriptions.certificationCandidateId',
    )
    .leftJoin(
      'complementary-certifications',
      'certification-subscriptions.complementaryCertificationId',
      'complementary-certifications.id',
    );
}
