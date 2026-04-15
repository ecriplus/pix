// @ts-check
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CertificationCandidateNotFoundError } from '../../../../shared/domain/errors.js';
import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { SCOPES } from '../../../shared/domain/models/Scopes.js';
import { Candidate } from '../../domain/models/Candidate.js';

/**
 * @typedef {object} RawCertificationCandidateResult
 * @property {boolean} accessibilityAdjustmentNeeded
 * @property {Date} reconciledAt
 * @property {ComplementaryCertificationKeys | null} complementaryCertificationKey
 * @property {string | null} subscription
 */

/**
 * @function
 * @param {object} params
 * @param {number} params.assessmentId
 * @returns {Promise<Candidate>}
 * @throws {CertificationCandidateNotFoundError}
 */
export const findByAssessmentId = async function ({ assessmentId }) {
  const knexConn = DomainTransaction.getConnection();

  const result = await knexConn('certification-candidates')
    .select(
      'certification-candidates.accessibilityAdjustmentNeeded',
      'certification-candidates.reconciledAt',
      'certification-candidates.subscription',
      {
        complementaryCertificationKey: 'complementary-certifications.key',
      },
    )
    .join('certification-courses', 'certification-courses.candidateId', 'certification-candidates.id')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .leftJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.certificationCourseId',
      'certification-courses.id',
    )
    .leftJoin(
      'complementary-certifications',
      'complementary-certification-courses.complementaryCertificationId',
      'complementary-certifications.id',
    )
    .where('assessments.id', assessmentId)
    .first();

  if (!result) {
    throw new CertificationCandidateNotFoundError();
  }

  return _toDomain(result);
};

/**
 * @function
 * @param {RawCertificationCandidateResult} params
 * @returns {Candidate}
 */
const _toDomain = ({ accessibilityAdjustmentNeeded, reconciledAt, complementaryCertificationKey, subscription }) => {
  const subscriptionScope = subscription || _determineScope(complementaryCertificationKey);
  return new Candidate({
    accessibilityAdjustmentNeeded,
    reconciledAt,
    subscriptionScope,
    hasCleaSubscription: complementaryCertificationKey === ComplementaryCertificationKeys.CLEA,
  });
};

/**
 * @function
 * @param {ComplementaryCertificationKeys | null} complementaryCertificationKey
 * @returns {SCOPES}
 */
const _determineScope = (complementaryCertificationKey) => {
  if (complementaryCertificationKey && complementaryCertificationKey !== ComplementaryCertificationKeys.CLEA) {
    return complementaryCertificationKey;
  }
  return SCOPES.CORE;
};
