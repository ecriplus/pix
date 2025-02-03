import { uncancel } from '../../../../../../src/certification/session-management/domain/usecases/uncancel.js';
import { NotFinalizedSessionError } from '../../../../../../src/shared/domain/errors.js';
import CertificationUncancelled from '../../../../../../src/shared/domain/events/CertificationUncancelled.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Session-management | Unit | Domain | UseCases | uncancel', function () {
  it('should uncancel the certification course', async function () {
    // given
    const juryId = 123;
    const session = domainBuilder.certification.sessionManagement.buildSession({ finalizedAt: new Date('2020-01-01') });
    const certificationCourse = domainBuilder.buildCertificationCourse({ id: 123, sessionId: session.id });
    sinon.spy(certificationCourse, 'uncancel');
    const certificationCourseRepository = {
      update: sinon.stub(),
      get: sinon.stub(),
    };
    const certificationRescoringRepository = {
      execute: sinon.stub(),
    };
    const sessionRepository = {
      get: sinon.stub(),
    };
    certificationCourseRepository.get.withArgs({ id: 123 }).resolves(certificationCourse);
    certificationCourseRepository.update.resolves();
    certificationRescoringRepository.execute.resolves();
    sessionRepository.get.withArgs({ id: certificationCourse.getSessionId() }).resolves(session);

    // when
    await uncancel({
      certificationCourseId: 123,
      juryId,
      certificationCourseRepository,
      certificationRescoringRepository,
      sessionRepository,
    });

    // then
    expect(certificationCourse.uncancel).to.have.been.calledOnce;
    expect(certificationCourseRepository.update).to.have.been.calledWithExactly({ certificationCourse });
    expect(certificationRescoringRepository.execute).to.have.been.calledWithExactly({
      event: new CertificationUncancelled({
        certificationCourseId: certificationCourse.getId(),
        juryId,
      }),
    });
  });

  describe('when session is not finalized', function () {
    it('should not uncancel the certification course', async function () {
      // given
      const juryId = 123;
      const session = domainBuilder.certification.sessionManagement.buildSession({ finalizedAt: null });
      const certificationCourse = domainBuilder.buildCertificationCourse({ id: 123, sessionId: session.id });
      sinon.spy(certificationCourse, 'uncancel');
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
      const error = await catchErr(uncancel)({
        juryId,
        certificationCourseId: 123,
        certificationCourseRepository,
        sessionRepository,
      });

      // then
      expect(certificationCourse.uncancel).to.not.have.been.called;
      expect(certificationCourseRepository.update).to.not.have.been.called;
      expect(error).to.be.instanceOf(NotFinalizedSessionError);
    });
  });
});
