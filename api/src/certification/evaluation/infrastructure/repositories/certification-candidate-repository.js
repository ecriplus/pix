import { knex } from '../../../../../db/knex-database-connection.js';
import { CertificationCandidateNotFoundError } from '../../../../shared/domain/errors.js';
import { Candidate } from '../../../evaluation/domain/models/Candidate.js';
import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { Scopes } from '../../../shared/domain/models/Scopes.js';

export const findByAssessmentId = async function ({ assessmentId }) {
  const result = await knex('certification-candidates')
    .select('certification-candidates.accessibilityAdjustmentNeeded', 'certification-candidates.reconciledAt', {
      complementaryCertificationKey: 'complementary-certifications.key',
    })
    .join('certification-courses', function () {
      this.on('certification-courses.userId', '=', 'certification-candidates.userId').andOn(
        'certification-courses.sessionId',
        '=',
        'certification-candidates.sessionId',
      );
    })
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

const _toDomain = ({ accessibilityAdjustmentNeeded, reconciledAt, complementaryCertificationKey }) => {
  return new Candidate({
    accessibilityAdjustmentNeeded,
    reconciledAt,
    subscriptionScope: _determineScope(complementaryCertificationKey),
  });
};

const _determineScope = (complementaryCertificationKey) => {
  if (complementaryCertificationKey && complementaryCertificationKey !== ComplementaryCertificationKeys.CLEA) {
    return complementaryCertificationKey;
  }
  return Scopes.CORE;
};
