import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import * as answerRepository from '../../../../shared/infrastructure/repositories/answer-repository.js';
import { AssessmentSheet } from '../../domain/models/AssessmentSheet.js';

export async function findByCertificationCourseId(certificationCourseId) {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn
    .select({
      certificationCourseId: 'certification-courses.id',
      userId: 'certification-courses.userId',
      assessmentId: 'assessments.id',
      lastChallengeId: 'assessments.lastChallengeId',
      lastQuestionDate: 'assessments.lastQuestionDate',
      lastQuestionState: 'assessments.lastQuestionState',
      lastAnswerAt: 'certification-courses.lastAnswerAt',
      abortReason: 'certification-courses.abortReason',
      isRejectedForFraud: 'certification-courses.isRejectedForFraud',
      state: 'assessments.state',
      assessmentUpdatedAt: 'assessments.updatedAt',
      certificationCourseUpdatedAt: 'certification-courses.updatedAt',
      versionId: 'certification-courses.versionId',
      certificationFramework: 'certification-courses.framework',
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

export async function getByAssessmentId(assessmentId) {
  const knexConn = DomainTransaction.getConnection();
  const data = await knexConn
    .select({
      certificationCourseId: 'certification-courses.id',
      userId: 'certification-courses.userId',
      assessmentId: 'assessments.id',
      lastChallengeId: 'assessments.lastChallengeId',
      lastQuestionDate: 'assessments.lastQuestionDate',
      lastQuestionState: 'assessments.lastQuestionState',
      lastAnswerAt: 'certification-courses.lastAnswerAt',
      abortReason: 'certification-courses.abortReason',
      isRejectedForFraud: 'certification-courses.isRejectedForFraud',
      state: 'assessments.state',
      assessmentUpdatedAt: 'assessments.updatedAt',
      certificationCourseUpdatedAt: 'certification-courses.updatedAt',
      versionId: 'certification-courses.versionId',
      certificationFramework: 'certification-courses.framework',
      lang: 'certification-courses.lang',
      accessibilityAdjustmentNeeded: 'certification-candidates.accessibilityAdjustmentNeeded',
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .join('certification-candidates', 'certification-candidates.id', 'certification-courses.candidateId')
    .where('assessments.id', '=', assessmentId)
    .forUpdate('assessments')
    .first();

  if (!data) {
    throw new NotFoundError();
  }
  const answers = await answerRepository.findByAssessment(data.assessmentId);

  _sortAnswersByCreationDate(answers);

  return new AssessmentSheet({
    ...data,
    answers,
  });
}

export async function update(assessmentSheet) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('assessments')
    .update({
      updatedAt: assessmentSheet.assessmentUpdatedAt,
      state: assessmentSheet.state,
    })
    .where({ id: assessmentSheet.assessmentId });
  await knexConn('certification-courses')
    .update({
      updatedAt: assessmentSheet.certificationCourseUpdatedAt,
      lastAnswerAt: assessmentSheet.lastAnswerAt,
    })
    .where({ id: assessmentSheet.certificationCourseId });
}

function _sortAnswersByCreationDate(answers) {
  return answers.sort((a, b) => a.createdAt - b.createdAt);
}
