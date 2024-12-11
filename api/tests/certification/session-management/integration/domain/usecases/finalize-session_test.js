import { SessionWithAbortReasonOnCompletedCertificationCourseError } from '../../../../../../src/certification/session-management/domain/errors.js';
import { usecases } from '../../../../../../src/certification/session-management/domain/usecases/index.js';
import { ABORT_REASONS } from '../../../../../../src/certification/shared/domain/models/CertificationCourse.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | Session Management | Integration | Domain | UseCase | Finalize Session ', function () {
  context('When there is an abort reason for completed certification course', function () {
    it('should throw an SessionWithAbortReasonOnCompletedCertificationCourseError error', async function () {
      const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
        abortReason: ABORT_REASONS.CANDIDATE,
        completedAt: new Date(),
      });
      await databaseBuilder.commit();
      const certificationReports = [
        { certificationCourseId: certificationCourse.id, abortReason: ABORT_REASONS.CANDIDATE },
      ];

      const err = await catchErr(usecases.finalizeSession)({
        sessionId: certificationCourse.sessionId,
        certificationReports,
      });

      expect(err).to.be.instanceOf(SessionWithAbortReasonOnCompletedCertificationCourseError);
      const updatedCertificationCourse = await knex('certification-courses')
        .where('id', certificationCourse.id)
        .first();
      expect(updatedCertificationCourse.abortReason).to.be.null;
    });
  });
});
