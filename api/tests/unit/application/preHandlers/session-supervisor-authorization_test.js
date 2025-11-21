import { assessmentInvigilatorAuthorization as sessionInvigilatorAuthorization } from '../../../../src/certification/shared/application/pre-handlers/session-invigilator-authorization.js';
import { expect, generateAuthenticatedUserRequestHeaders, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Pre-handler | Invigilator Authorization', function () {
  let supervisorAccessRepository;
  let dependencies;

  beforeEach(function () {
    supervisorAccessRepository = {
      isUserSupervisorForSessionCandidate: sinon.stub(),
      isUserSupervisorForSession: sinon.stub(),
    };
    dependencies = { supervisorAccessRepository };
  });

  describe('#verifyByCertificationCandidateId', function () {
    const request = {
      headers: generateAuthenticatedUserRequestHeaders({ userId: 100 }),
      params: {
        certificationCandidateId: 8,
      },
    };

    describe('When user is the invigilator of the assessment session', function () {
      it('should return true', async function () {
        // given
        supervisorAccessRepository.isUserSupervisorForSessionCandidate
          .withArgs({
            certificationCandidateId: 8,
            supervisorId: 100,
          })
          .resolves(true);

        // when
        const response = await sessionInvigilatorAuthorization.verifyByCertificationCandidateId(
          request,
          hFake,
          dependencies,
        );

        // then
        expect(response).to.be.true;
      });
    });

    describe('When user is not the invigilator of the assessment session', function () {
      it('should return 401', async function () {
        // given
        supervisorAccessRepository.isUserSupervisorForSessionCandidate
          .withArgs({
            certificationCandidateId: 8,
            supervisorId: 100,
          })
          .resolves(false);

        // when
        const response = await sessionInvigilatorAuthorization.verifyByCertificationCandidateId(
          request,
          hFake,
          dependencies,
        );

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });

  describe('#verifyBySessionId', function () {
    const request = {
      headers: generateAuthenticatedUserRequestHeaders({ userId: 100 }),
      params: {
        sessionId: 201,
      },
    };

    describe('When user is the invigilator of the assessment session', function () {
      it('should return true', async function () {
        // given
        supervisorAccessRepository.isUserSupervisorForSession.resolves(true);

        // when
        const response = await sessionInvigilatorAuthorization.verifyBySessionId(request, hFake, dependencies);

        // then
        sinon.assert.calledWith(supervisorAccessRepository.isUserSupervisorForSession, {
          sessionId: 201,
          userId: 100,
        });
        expect(response).to.be.true;
      });
    });

    describe('When user is not the invigilator of the session', function () {
      it('should return status code 401', async function () {
        // given
        supervisorAccessRepository.isUserSupervisorForSession.resolves(false);
        request.headers = generateAuthenticatedUserRequestHeaders({ userId: 101 });

        // when
        const response = await sessionInvigilatorAuthorization.verifyBySessionId(request, hFake, dependencies);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
