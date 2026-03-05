/**
 * @typedef {import('./index.js').SessionRepository} SessionRepository
 */
import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import {
  SessionAlreadyFinalizedError,
  SessionWithMissingAbortReasonError,
  SessionWithoutStartedCertificationError,
} from '../errors.js';

/**
 * @param {object} params
 * @param {SessionRepository} params.sessionRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {CertificationReportRepository} params.certificationReportRepository
 * @return {Promise<Session>}
 */
const finalizeSession = withTransaction(async function ({
  sessionId,
  examinerGlobalComment,
  certificationReports,
  hasIncident,
  hasJoiningIssue,
  sessionRepository,
}) {
  const session = await sessionRepository.get({ id: sessionId });
  if (!session) {
    throw new NotFoundError(`Session introuvable : id ${sessionId}`);
  }

  if (session.isFinalized) {
    throw new SessionAlreadyFinalizedError();
  }

  if (!session.hasStarted) {
    throw new SessionWithoutStartedCertificationError();
  }
  certificationReports.forEach((certifReport) => certifReport.validateForFinalization());

  const abortReasonCount = _countAbortReasons(certificationReports);

  if (
    _hasMissingAbortReasonForUncompletedCertificationCourse({
      abortReasonCount,
      uncompletedCertificationCount: session.uncompletedCertificationCount,
    })
  ) {
    throw new SessionWithMissingAbortReasonError();
  }

  session.finalize({
    examinerGlobalComment,
    hasIncident,
    hasJoiningIssue,
    certificationReports,
  });

  await sessionRepository.save({ session });

  return session;
});

export { finalizeSession };

function _hasMissingAbortReasonForUncompletedCertificationCourse({ abortReasonCount, uncompletedCertificationCount }) {
  return abortReasonCount < uncompletedCertificationCount;
}

function _countAbortReasons(certificationReports) {
  return certificationReports.filter(({ abortReason }) => abortReason).length;
}
