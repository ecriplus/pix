import { Session } from '../../../../../../src/certification/session-management/domain/models/Session.js';

export function buildSession({
  id = 123,
  finalizedAt = null,
  examinerGlobalComment = null,
  hasIncident = false,
  hasJoiningIssue = false,
  certificationCenterName = 'Foo Certif Center',
  date = '2010-01-01',
  time = '12:00:00',
  certificationCourses = [],
} = {}) {
  return new Session({
    id,
    finalizedAt,
    examinerGlobalComment,
    hasIncident,
    hasJoiningIssue,
    certificationCenterName,
    date,
    time,
    certificationCourses,
  });
}
