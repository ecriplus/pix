import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import * as answerRepository from '../../../../shared/infrastructure/repositories/answer-repository.js';
import { AssessmentSheet } from '../../domain/models/AssessmentSheet.js';

export async function findByCertificationCourseId(certificationCourseId) {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn
    .select({
      certificationCourseId: 'certification-courses.id',
      assessmentId: 'assessments.id',
      abortReason: 'certification-courses.abortReason',
      isRejectedForFraud: 'certification-courses.isRejectedForFraud',
      state: 'assessments.state',
      updatedAt: 'assessments.updatedAt',
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .where('certification-courses.id', '=', certificationCourseId)
    .first();

  if (!data) return null;

  const answers = await answerRepository.findByAssessment(data.assessmentId);

  return new AssessmentSheet({
    ...data,
    answers,
  });
}

export async function update(assessmentSheet) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('assessments')
    .update({
      updatedAt: assessmentSheet.updatedAt,
      state: assessmentSheet.state,
    })
    .where('assessments.id', '=', assessmentSheet.assessmentId);
}
