import { knex } from '../../../../../db/knex-database-connection.js';
import { CertificationCandidateNotFoundError } from '../../../../shared/domain/errors.js';
import { CandidateFactory } from '../../domain/models/factories/CandidateFactory.js';

export const findByAssessmentId = async function ({ assessmentId }) {
  const result = await knex('certification-candidates')
    .select(
      'certification-candidates.accessibilityAdjustmentNeeded',
      'certification-candidates.reconciledAt',
      { subscriptionType: 'certification-subscriptions.type' },
      { complementaryCertificationKey: 'complementary-certifications.key' },
    )
    .join('certification-courses', function () {
      this.on('certification-courses.userId', '=', 'certification-candidates.userId').andOn(
        'certification-courses.sessionId',
        '=',
        'certification-candidates.sessionId',
      );
    })
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .join(
      'certification-subscriptions',
      'certification-subscriptions.certificationCandidateId',
      'certification-candidates.id',
    )
    .leftJoin(
      'complementary-certifications',
      'certification-subscriptions.complementaryCertificationId',
      'complementary-certifications.id',
    )
    .where('assessments.id', assessmentId)
    .first();

  if (!result) {
    throw new CertificationCandidateNotFoundError();
  }

  return _toDomain(result);
};

const _toDomain = ({
  accessibilityAdjustmentNeeded,
  reconciledAt,
  subscriptionType,
  complementaryCertificationKey,
}) => {
  return CandidateFactory.fromSubscription({
    accessibilityAdjustmentNeeded,
    reconciledAt,
    subscriptionType,
    complementaryCertificationKey,
  });
};
