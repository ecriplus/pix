import * as moduleUnderTest from '../../../../../src/prescription/organization-learner/application/sco-organization-learner-route.js';
import { usecases } from '../../../../../src/prescription/organization-learner/domain/usecases/index.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { NotFoundError, UserNotAuthorizedToUpdatePasswordError } from '../../../../../src/shared/domain/errors.js';
import { domainBuilder, expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Integration | Application | sco-organization-learners | sco-organization-learner-controller', function () {
  let sandbox;
  let httpTestServer;

  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(usecases, 'updateOrganizationLearnerDependentUserPassword').rejects(new Error('not expected error'));
    sandbox.stub(securityPreHandlers, 'checkUserBelongsToScoOrganizationAndManagesStudents');
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#updatePassword', function () {
    const payload = { data: { attributes: {} } };
    const auth = { credentials: {}, strategy: {} };
    const generatedPassword = 'Passw0rd';

    beforeEach(function () {
      securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents.callsFake((request, h) =>
        h.response(true),
      );

      payload.data.attributes = {
        'organization-learner-id': 1,
        'organization-id': 3,
      };

      auth.credentials.userId = domainBuilder.buildUser().id;
    });

    context('Success cases', function () {
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.updateOrganizationLearnerDependentUserPassword.resolves({
          generatedPassword,
          organizationLearnersId: 1,
        });

        // when
        const response = await httpTestServer.request(
          'POST',
          '/api/sco-organization-learners/password-update',
          payload,
          auth,
        );

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['generated-password']).to.equal(generatedPassword);
      });
    });

    context('Error cases', function () {
      context('when a NotFoundError is thrown', function () {
        it('should resolve a 404 HTTP response', async function () {
          // given
          usecases.updateOrganizationLearnerDependentUserPassword.rejects(new NotFoundError());

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/sco-organization-learners/password-update',
            payload,
            auth,
          );

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      context('when a UserNotAuthorizedToUpdatePasswordError is thrown', function () {
        it('should resolve a 403 HTTP response', async function () {
          // given
          usecases.updateOrganizationLearnerDependentUserPassword.rejects(new UserNotAuthorizedToUpdatePasswordError());

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/sco-organization-learners/password-update',
            payload,
            auth,
          );

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });
});
