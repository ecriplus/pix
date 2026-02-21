import { knex } from '../db.ts';
import { PIX_CERTIF_PRO_DATA } from '../db-data.ts';
import { buildCleaData, buildCoreVersion, buildCpfData, buildPixCertifUser } from './builders/index.ts';

export async function buildCertificationData() {
  await buildCpfData(knex);
  await buildCoreVersion(knex);
  await buildCleaData(knex);
  await buildPixCertifUser(knex, PIX_CERTIF_PRO_DATA);
}

export async function changeCandidateAnswers(certificationId: number, rightWrongAnswersSequence: boolean[]) {
  const answerIds = await knex
    .from('assessments')
    .join('answers', 'answers.assessmentId', 'assessments.id')
    .where('assessments.certificationCourseId', certificationId)
    .orderBy('answers.createdAt', 'ASC')
    .pluck('answers.id');

  for (const [i, answerId] of answerIds.entries()) {
    const nextResult = rightWrongAnswersSequence[i] ? 'ok' : 'ko';
    await knex('answers').update('result', nextResult).where('answers.id', answerId);
  }
}
