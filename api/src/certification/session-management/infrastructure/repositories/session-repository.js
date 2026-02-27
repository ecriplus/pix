import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { batchUpdate } from '../../../../shared/infrastructure/utils/knex-utils.js';
import { CertificationCourse } from '../../domain/models/CertificationCourse.js';
import { Session } from '../../domain/models/Session.js';

export async function get({ id }) {
  const knexConn = DomainTransaction.getConnection();

  const sessionData = await knexConn
    .select({
      id: 'sessions.id',
      finalizedAt: 'sessions.finalizedAt',
      examinerGlobalComment: 'sessions.examinerGlobalComment',
      hasIncident: 'sessions.hasIncident',
      hasJoiningIssue: 'sessions.hasJoiningIssue',
      certificationCenterName: 'sessions.certificationCenter',
      date: 'sessions.date',
      time: 'sessions.time',
      certificationCourseId: 'certification-courses.id',
      certificationCourseVersion: 'certification-courses.version',
      certificationCourseUpdatedAt: 'certification-courses.updatedAt',
      certificationCourseEndedAt: 'certification-courses.endedAt',
      certificationCourseCompletedAt: 'certification-courses.completedAt',
      certificationCourseAbortReason: 'certification-courses.abortReason',
      certificationCourseAssessmentId: 'assessments.id',
      certificationCourseAssessmentState: 'assessments.state',
      certificationCourseAssessmentUpdatedAt: 'assessments.updatedAt',
    })
    .from('sessions')
    .leftJoin('certification-courses', 'certification-courses.sessionId', 'sessions.id')
    .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .where('sessions.id', id)
    .orderBy('certification-courses.id');

  if (sessionData.length === 0) {
    return null;
  }

  const certificationCourses = [];
  for (const certificationCourseData of sessionData) {
    if (certificationCourseData.certificationCourseId) {
      const certificationCourse = new CertificationCourse({
        id: certificationCourseData.certificationCourseId,
        version: certificationCourseData.certificationCourseVersion,
        updatedAt: certificationCourseData.certificationCourseUpdatedAt,
        endedAt: certificationCourseData.certificationCourseEndedAt,
        completedAt: certificationCourseData.certificationCourseCompletedAt,
        abortReason: certificationCourseData.certificationCourseAbortReason,
        assessmentId: certificationCourseData.certificationCourseAssessmentId,
        assessmentState: certificationCourseData.certificationCourseAssessmentState,
        assessmentLatestActivityAt: certificationCourseData.certificationCourseAssessmentUpdatedAt,
      });
      certificationCourses.push(certificationCourse);
    }
  }

  return new Session({
    ...sessionData[0],
    certificationCourses,
  });
}

export async function save({ session }) {
  const knexConn = DomainTransaction.getConnection();

  const sessionDataToUpdate = {
    examinerGlobalComment: session.examinerGlobalComment,
    hasIncident: session.hasIncident,
    hasJoiningIssue: session.hasJoiningIssue,
    finalizedAt: session.finalizedAt,
  };
  await knexConn('sessions').update(sessionDataToUpdate).where({ id: session.id });

  const certificationCoursesDataToUpdate = session.certificationCourses.map((certificationCourse) => ({
    id: certificationCourse.id,
    updatedAt: certificationCourse.updatedAt,
    endedAt: certificationCourse.endedAt,
    abortReason: certificationCourse.abortReason,
  }));
  await batchUpdate({
    tableName: 'certification-courses',
    primaryKeyName: 'id',
    rows: certificationCoursesDataToUpdate,
  });

  const assessmentsDataToUpdate = session.certificationCourses.map((certificationCourse) => ({
    id: certificationCourse.assessmentId,
    state: certificationCourse.assessmentState,
  }));
  await batchUpdate({
    tableName: 'assessments',
    primaryKeyName: 'id',
    rows: assessmentsDataToUpdate,
  });
}

export async function saveCertification({ certificationCourse }) {
  const knexConn = DomainTransaction.getConnection();
  await knexConn('certification-courses')
    .update({
      updatedAt: certificationCourse.updatedAt,
      endedAt: certificationCourse.endedAt,
      abortReason: certificationCourse.abortReason,
    })
    .where({ id: certificationCourse.id });

  await knexConn('assessments')
    .update({
      state: certificationCourse.assessmentState,
    })
    .where({ id: certificationCourse.assessmentId });
}
