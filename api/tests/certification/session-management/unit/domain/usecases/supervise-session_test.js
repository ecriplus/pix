import {
  CertificationCenterIsArchivedError,
  InvalidSessionSupervisingLoginError,
  SessionNotAccessible,
} from '../../../../../../src/certification/session-management/domain/errors.js';
import { superviseSession } from '../../../../../../src/certification/session-management/domain/usecases/supervise-session.js';
import { config as settings } from '../../../../../../src/shared/config.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | supervise-session', function () {
  let sessionRepository;
  let supervisorAccessRepository;
  let certificationCenterRepository;
  let certificationPointOfContactRepository;
  let pixCertifBlockedAccessUntilDateBeforeTest;

  beforeEach(function () {
    sessionRepository = {
      get: sinon.stub(),
    };
    supervisorAccessRepository = {
      create: sinon.stub(),
    };
    certificationCenterRepository = {
      getBySessionId: sinon.stub(),
    };
    certificationPointOfContactRepository = {
      getAllowedCenterAccesses: sinon.stub(),
    };

    pixCertifBlockedAccessUntilDateBeforeTest = settings.features.pixCertifBlockedAccessUntilDate;
  });

  afterEach(function () {
    settings.features.pixCertifBlockedAccessUntilDate = pixCertifBlockedAccessUntilDateBeforeTest;
  });

  describe('when pix certif access is blocked', function () {
    it('should throw a SessionNotAccessible error', async function () {
      // given
      sinon.stub(settings.features, 'pixCertifBlockedAccessUntilDate').value('2322-07-01');
      const sessionId = 123;
      const certificationCenter = domainBuilder.buildCertificationCenter();
      const session = domainBuilder.certification.sessionManagement.buildSession({
        id: sessionId,
        certificationCenterId: certificationCenter.id,
      });
      const invigilatorPassword = session.invigilatorPassword;
      const userId = 434;
      const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
        id: certificationCenter.id,
      });

      sessionRepository.get.resolves(session);
      certificationPointOfContactRepository.getAllowedCenterAccesses.resolves([allowedCertificationCenterAccess]);
      certificationCenterRepository.getBySessionId.resolves(certificationCenter);

      // when
      const error = await catchErr(superviseSession)({
        sessionId,
        invigilatorPassword,
        userId,
        sessionRepository,
        supervisorAccessRepository,
        certificationCenterRepository,
        certificationPointOfContactRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(SessionNotAccessible);
      expect(error.meta).to.deep.equal({ blockedAccessDate: '2322-07-01' });
    });
  });

  it('should throw a InvalidSessionSupervisingLoginError when the supervised password is wrong', async function () {
    // given
    const sessionId = 123;
    const invigilatorPassword = 'NOT_MATCHING_INVIGILATOR_PASSWORD';
    const certificationCenter = domainBuilder.buildCertificationCenter();
    const session = domainBuilder.certification.sessionManagement.buildSession({
      id: sessionId,
      certificationCenterId: certificationCenter.id,
    });
    const userId = 434;
    const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
      id: certificationCenter.id,
    });

    sessionRepository.get.resolves(session);
    certificationPointOfContactRepository.getAllowedCenterAccesses.resolves([allowedCertificationCenterAccess]);
    certificationCenterRepository.getBySessionId.resolves(certificationCenter);

    // when
    const error = await catchErr(superviseSession)({
      sessionId,
      invigilatorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
      certificationCenterRepository,
      certificationPointOfContactRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidSessionSupervisingLoginError);
    expect(error.message).to.equal('Le numéro de session et/ou le mot de passe saisis sont incorrects.');
  });

  it('should throw a SessionNotAccessible when the session is not accessible', async function () {
    // given
    const sessionId = 123;
    const certificationCenter = domainBuilder.buildCertificationCenter();
    const session = domainBuilder.certification.sessionManagement.buildSession.processed({ id: sessionId });
    const userId = 434;
    const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
      id: certificationCenter.id,
    });

    sessionRepository.get.resolves(session);
    certificationPointOfContactRepository.getAllowedCenterAccesses.resolves([allowedCertificationCenterAccess]);
    certificationCenterRepository.getBySessionId.resolves(certificationCenter);

    // when
    const error = await catchErr(superviseSession)({
      sessionId,
      invigilatorPassword: session.invigilatorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
      certificationCenterRepository,
      certificationPointOfContactRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(SessionNotAccessible);
  });

  it('should a Certification center is archived error when certification center is archived', async function () {
    // given
    // given
    const sessionId = 123;
    const certificationCenter = domainBuilder.buildCertificationCenter();
    const session = domainBuilder.certification.sessionManagement.buildSession.created({ id: sessionId });
    const userId = 434;
    const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
      id: certificationCenter.id,
    });

    sessionRepository.get.resolves(session);
    certificationCenterRepository.getBySessionId.resolves({ archivedAt: new Date(), archivedBy: 1234 });
    certificationPointOfContactRepository.getAllowedCenterAccesses.resolves([allowedCertificationCenterAccess]);

    // when
    const error = await catchErr(superviseSession)({
      sessionId,
      invigilatorPassword: session.invigilatorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
      certificationCenterRepository,
      certificationPointOfContactRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(CertificationCenterIsArchivedError);
  });

  it('should create a supervisor access', async function () {
    // given
    const sessionId = 123;
    const userId = 434;
    const certificationCenter = domainBuilder.buildCertificationCenter();
    const allowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
      id: certificationCenter.id,
    });
    const session = domainBuilder.certification.sessionManagement.buildSession.created({ id: sessionId });

    certificationPointOfContactRepository.getAllowedCenterAccesses.resolves([allowedCertificationCenterAccess]);
    sessionRepository.get.resolves(session);
    certificationCenterRepository.getBySessionId.resolves({ archivedAt: null, archivedBy: null });

    // when
    await superviseSession({
      sessionId,
      invigilatorPassword: session.invigilatorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
      certificationCenterRepository,
      certificationPointOfContactRepository,
    });

    // then
    expect(supervisorAccessRepository.create).to.have.been.calledWithExactly({ sessionId, userId });
  });
});
