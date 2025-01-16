import { cancelCertificationCourse } from '../../../../../../src/certification/session-management/domain/usecases/cancel-certification-course.js';
import { NotFinalizedSessionError } from '../../../../../../src/shared/domain/errors.js';
import CertificationCancelled from '../../../../../../src/shared/domain/events/CertificationCancelled.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Session-management | Unit | Domain | UseCases | cancel-certification-course', function () {
  describe('when session is finalized', function () {
    it('should cancel the certification course', async function () {
      // given
      const juryId = 123;
      const session = domainBuilder.certification.sessionManagement.buildSession({
        finalizedAt: new Date('2020-01-01'),
      });
      const certificationCourse = domainBuilder.buildCertificationCourse({ id: 123, sessionId: session.id });
      sinon.spy(certificationCourse, 'cancel');
      const certificationCourseRepository = {
        update: sinon.stub(),
        get: sinon.stub(),
      };
      const sessionRepository = {
        get: sinon.stub(),
      };
      certificationCourseRepository.get.withArgs({ id: 123 }).resolves(certificationCourse);
      certificationCourseRepository.update.resolves();
      sessionRepository.get.withArgs({ id: certificationCourse.getSessionId() }).resolves(session);

      // when
      const cancelledEvent = await cancelCertificationCourse({
        certificationCourseId: 123,
        certificationCourseRepository,
        sessionRepository,
        juryId,
      });

      // then
      expect(certificationCourse.cancel).to.have.been.calledOnce;
      expect(certificationCourseRepository.update).to.have.been.calledWithExactly({ certificationCourse });
      expect(cancelledEvent).to.deepEqualInstance(new CertificationCancelled({ certificationCourseId: 123, juryId }));
    });
  });

  describe('when session is not finalized', function () {
    it('should not cancel the certification course', async function () {
      // given
      const juryId = 123;
      const session = domainBuilder.certification.sessionManagement.buildSession({ finalizedAt: null });
      const certificationCourse = domainBuilder.buildCertificationCourse({ id: 123, sessionId: session.id });
      sinon.spy(certificationCourse, 'cancel');
      const certificationCourseRepository = {
        update: sinon.stub(),
        get: sinon.stub(),
      };
      const sessionRepository = {
        get: sinon.stub(),
      };
      certificationCourseRepository.get.withArgs({ id: 123 }).resolves(certificationCourse);
      certificationCourseRepository.update.resolves();
      sessionRepository.get.withArgs({ id: certificationCourse.getSessionId() }).resolves(session);

      // when
      const error = await catchErr(cancelCertificationCourse)({
        certificationCourseId: 123,
        certificationCourseRepository,
        sessionRepository,
        juryId,
      });

      // then
      expect(certificationCourse.cancel).to.not.have.been.called;
      expect(certificationCourseRepository.update).to.not.have.been.called;
      expect(error).to.be.instanceOf(NotFinalizedSessionError);
    });
  });
});
